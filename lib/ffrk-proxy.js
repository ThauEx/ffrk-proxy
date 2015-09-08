var Proxy = require('thin');
var events = require('events');
var util = require('util');
var fs = require('fs');

var helpers = require(__dirname + '/helpers.js');

function FFRKProxy(certStore) {
  this.proxy = new Proxy({
    followRedirect: true,
    strictSSL: false,
    rejectUnauthorized: false,
    SNICallback: helpers.makeSNICallback(
      certStore.rootCaCert,
      certStore.rootCaKey
    ),
    cert: certStore.defaultCaCert,
    key: certStore.defaultCaKey
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
  var self = this;
  var reqUrl = clientReq.url;

  if (clientReq.connection.encrypted) {
    reqUrl = 'https://' + clientReq.headers.host + reqUrl;
  }

  console.log('Proxying:', clientReq.method, reqUrl);

  this.proxy.forward(clientReq, clientRes, function(proxyReq) {
    proxyReq.on('response', function (response) {
      var transform = null;

      if (clientReq.headers.host == 'ffrk.denagames.com') {
        if (clientReq.url.indexOf('get_battle_init_data') > -1) {
          console.info('number of event listener for "battleInitData"', self.listeners('battleInitData').length);
          if (self.listeners('battleInitData').length > 0) {
            transform = function(content, callback) {
              fs.writeFile(__dirname + "/../dump/get_battle_init_data-" + process.hrtime() + ".json", content, function (err) {
                if (err) {
                  console.error('Failed to write "get_battle_init_data" dump');
                }
              });
              json = helpers.jsonParse(content);
              self.emit('battleInitData', json, callback);
            };
          }
        }
      }

      if (typeof(transform) == 'function') {
        helpers.sendModifiedJsonResponse(clientRes, response, transform);
      } else {
        helpers.sendOriginalResponse(clientRes, response);
      }
    });

    proxyReq.on('error', function (err) {
        console.error(err, err.stack.split('\n'));
        clientRes.end();
    });
  });
};

module.exports = FFRKProxy;
