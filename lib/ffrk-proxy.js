var Proxy = require('./thin');
var events = require('events');
var util = require('util');
var fs = require('fs');

var helpers = require('./helpers');
var config = require('./config');

function FFRKProxy(certStore) {
  this.whitelist = false;

  if (config.get('application.proxy.whitelist')) {
    this.whitelist = config.get('application.proxy.domains');
  }

  this.proxy = new Proxy({
    followRedirect: true,
    strictSSL: false,
    rejectUnauthorized: false,
    SNICallback: helpers.makeSNICallback(
      certStore.rootCaCert,
      certStore.rootCaKey
    ),
    cert: certStore.defaultCaCert,
    key: certStore.defaultCaKey,
    whitelist: this.whitelist,
  });

  this.proxy.use(this.middleware.bind(this));
}

util.inherits(FFRKProxy, events.EventEmitter);

FFRKProxy.prototype.listen = function(port, host, callback) {
  this.proxy.listen(port, host, callback);
};

FFRKProxy.prototype.close = function() {
  this.proxy.close();
};

FFRKProxy.prototype.middleware = function(clientReq, clientRes, next) {
  var _this = this;
  var reqUrl = clientReq.url;

  if (clientReq.connection.encrypted) {
    reqUrl = 'https://' + clientReq.headers.host + reqUrl;
  }

  console.log('Proxying:', clientReq.method, reqUrl);
  this.proxy.forward(clientReq, clientRes, function(proxyReq) {
    proxyReq.on('response', function(response) {
      var transform = null;
      var domains = config.get('application.proxy.domains');

      if (domains.hasOwnProperty(clientReq.headers.host)) {
        if (clientReq.url.indexOf('get_battle_init_data') > -1) {
          console.info('number of event listener for "battleInitData"', _this.listeners('battleInitData').length);

          if (_this.listeners('battleInitData').length > 0) {
            transform = function(content, callback) {
              var json = helpers.jsonParse(content);

              _this.dumpJsonResponse('get_battle_init_data', content);
              _this.emit('battleInitData', json, callback);
            };
          }
        }
      }

      if (typeof transform == 'function') {
        helpers.sendModifiedJsonResponse(clientRes, response, transform);
      } else {
        helpers.sendOriginalResponse(clientRes, response);
      }
    });

    proxyReq.on('error', function(err) {
      console.error(err, err.stack.split('\n'));
      clientRes.end();
    });
  });
};

FFRKProxy.prototype.dumpJsonResponse = function(name, content) {
  if (config.get('application.dump.' + name)) {
    var filename = name + '-' + process.hrtime() + '.json';
    fs.writeFile(__dirname + '/../dump/' + filename, content, function(err) {
      if (err) {
        console.error('Failed to write "' + filename + '" dump');
      }
    });
  }
};

module.exports = FFRKProxy;
