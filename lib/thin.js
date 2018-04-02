var http = require('http');
var net = require('net');
var https = require('https');
var fs = require('fs');
var os = require('os');
var request = require('request');
var url = require('url');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var config = require('./config');

function Mitm(opts) {
  this.opts = opts || {};

  if (!this.opts.hasOwnProperty('whitelist')) {
    this.opts.whitelist = false;
  }

  if (!this.opts.hasOwnProperty('followRedirect')) {
    this.opts.followRedirect = true;
  }

  // Socket path for system mitm https server
  this.socketTemplate = os.tmpdir() + '/node-thin-{%s}.' + process.pid + '.sock';

  if (process.platform === 'win32') {
    this.socketTemplate = '4505{%s}';
  }


  this.socket = this.socketTemplate.replace('{%s}', '0');

  this.interceptors = [];
  this.httpsServers = {};
  console.debug = function() {
    if (config.get('application.debug') === true) {
      console.log.apply(console, arguments);
    }
  }
}

util.inherits(Mitm, EventEmitter);

Mitm.prototype.listen = function(port, host, cb) {
  var _this = this;

  if (process.platform !== 'win32') {
    // Make sure there's no previously created socket
    if (fs.existsSync(this.socket)) {
      fs.unlinkSync(this.socket);
    }
  }

  var options = {
    SNICallback: this.opts.SNICallback,
    key: this.opts.key || fs.readFileSync(__dirname + '/../cert/dummy.key', 'utf8'),
    cert: this.opts.cert || fs.readFileSync(__dirname + '/../cert/dummy.crt', 'utf8'),
  };

  // Fake https server, MITM if you want
  this.httpsServer = https.createServer(options, this._handler.bind(this)).listen(this.socket);

  if (this.opts.whitelist && Object.keys(this.opts.whitelist).length > 0) {
    Object.keys(this.opts.whitelist).forEach(function(element, index) {
      if (_this.opts.whitelist[element].hasOwnProperty('cert')) {
        var socket = _this.socketTemplate.replace('{%s}', (1 + index));
        var options = {
          SNICallback: _this.opts.SNICallback,
          cert: fs.readFileSync(_this.opts.whitelist[element].cert, 'utf8'),
          key: fs.readFileSync(_this.opts.whitelist[element].key, 'utf8'),
        };

        _this.httpsServers[element] = {
          server: https.createServer(options, _this._handler.bind(_this)).listen(socket),
          socket: socket,
        }
      }
    });
  }

  // Start HTTP server with custom request handler callback function
  this.httpServer = http.createServer(this._handler.bind(this)).listen(port, host, function(err) {
    if (err) {
      console.error('Cannot start proxy', err);
    }

    cb(err);
  });

  // Add handler for HTTPS (which issues a CONNECT to the proxy)
  this.httpServer.addListener('connect', this._httpsHandler.bind(this));
};

Mitm.prototype.close = function(cb) {
  var _this = this;

  _this.httpServer.close(function(err) {
    if (err) {
      return cb(err);
    }
    _this.httpsServer.close(cb);
  });
};

Mitm.prototype._handler = function(req, res) {

  var interceptors = this.interceptors.concat([this.direct.bind(this)]);
  var layer = 0;

  (function runner() {
    var interceptor = interceptors[layer++];
    interceptor(req, res, function(err) {
      if (err) {
        return res.end('Proxy error: ' + err.toString());
      }
      runner();
    });
  })();
};

Mitm.prototype._httpsHandler = function(request, socketRequest, bodyhead) {
  var _this = this;
  var host = request.url.replace(':443', '');
  var httpVersion = request.httpVersion;
  var doMitm = true;

  console.debug('  = will connect to socket "%s"', this.socket);

  // Set up TCP connection
  var proxySocket = new net.Socket();

  if (this.opts.whitelist && !this.opts.whitelist.hasOwnProperty(host)) {
    doMitm = false;
  }

  if (doMitm) {
    var socket = this.socket;

    if (this.httpsServers.hasOwnProperty(host) && this.httpsServers[host].hasOwnProperty('socket')) {
      socket = this.httpsServers[host].socket;
    }

    proxySocket.connect(socket, onProxySocketConnect);
  } else {
    host = request.headers.host || '';
    host = host.replace(':443', '');
    var port = this.isRequestEncrypted(request.url) ? 443 : 80;

    proxySocket.connect(port, host, onProxySocketConnect);
  }

  function onProxySocketConnect() {
    console.debug('< connected to socket "%s"', _this.socket);
    console.debug('> writing head of length %d', bodyhead.length);

    proxySocket.write(bodyhead);

    // Tell the caller the connection was successfully established
    socketRequest.write('HTTP/' + httpVersion + ' 200 Connection established\r\n\r\n');
  }

  proxySocket.on('data', function(chunk) {
    console.debug('< data length = %d', chunk.length);
    socketRequest.write(chunk);
  });

  proxySocket.on('end', function() {
    console.debug('< end');
    socketRequest.end();
  });

  socketRequest.on('data', function(chunk) {
    console.debug('> data length = %d', chunk.length);
    proxySocket.write(chunk);
  });

  socketRequest.on('end', function() {
    console.debug('> end');
    proxySocket.end();
  });

  proxySocket.on('error', function(err) {
    socketRequest.write('HTTP/' + httpVersion + ' 500 Connection error\r\n\r\n');
    console.error('< ERR (proxy socket): %s', err);
    socketRequest.end();
  });

  socketRequest.on('error', function(err) {
    console.error('> ERR (socket request): %s', err);
    proxySocket.end();
  });
};

Mitm.prototype.use = function(fn) {
  this.interceptors.push(fn);
};

Mitm.prototype.isRequestEncrypted = function(requestUrl) {
  var regexHostport = /^([^:]+)(:([0-9]+))?$/;
  var result = regexHostport.exec(requestUrl);

  if (result != null) {
    if (result[2] != null) {
      return true;
    }
  }

  return false;
};

Mitm.prototype.removeInterceptors = function() {
  this.interceptors.length = 0;
};

Mitm.prototype.forward = function(req, res, cb) {
  var path = url.parse(req.url).path;
  var schema = req.connection.encrypted ? 'https' : 'http';
  var dest = schema + '://' + req.headers.host + path;

  var params = {
    url: dest,
    path: req.url,
    host: req.headers.host,
    port: req.connection.encrypted ? 443 : 80,
    strictSSL: this.opts.strictSSL,
    rejectUnauthorized: this.opts.rejectUnauthorized,
    method: req.method,
    proxy: this.opts.proxy,
    followRedirect: this.opts.followRedirect,
    agent: false,
    headers: {},
  };

  // Set original headers except proxy system's headers
  var exclude = ['proxy-connection'];
  for (var hname in req.headers) {
    if (!~exclude.indexOf(hname)) {
      params.headers[hname] = req.headers[hname];
    }
  }

  var buffer = '';
  req.on('data', function(chunk) {
    buffer += chunk;
  });

  req.on('end', function() {
    params.body = buffer;
    var proxyReq = request(params);
    cb(proxyReq);
  });
};

Mitm.prototype.direct = function(req, res) {
  var _this = this;

  this.forward(req, res, function(r) {
    r.on('error', function(err) {
      _this.emit('error', err);
      res.end();
    });
    r.pipe(res);
  });
};

module.exports = Mitm;
