/*
  Modify HTML responses, replacing 'the' with 'BADGER BADGER BADGER'.

  Demonstrates simple text replacement on HTML responses.
 */

var Thin = require('../');
var helpers = require('./helpers');
var http = require('http');

var proxy = new Thin({
    followRedirect: false,
    strictSSL: true,
    SNICallback: helpers.makeSNICallback()
});

/*
  Change "the" to "BADGER BADGER BADGER".

  This is a really crude, brute-force edit of HTML responses. To do it properly, it's better
  to inject a client-side script to edit text DOM nodes, or use 'jsdom' to parse the HTML content
  and only modify text nodes.

  Using "the" as a literal match breaks too much HTML and CSS (e.g. "themes" gets modified), so only
  " the " (with spaces around it) is really replaced.
 */
proxy.use(function(clientReq, clientRes, next) {
    console.log('Proxying:', clientReq.url);

    proxy.forward(clientReq, clientRes, function(proxyReq) {
        proxyReq.on('response', function (response) {
            var contentType = response.headers['content-type'],
                isHtml = typeof contentType !== 'undefined' && contentType.indexOf('text/html') !== -1;

            if (!isHtml) {
                helpers.sendOriginalResponse(clientRes, response);
            } else {
                var transform = function(content, cb) {
                    var edited = content.toString().replace(/ the /gi, ' BADGER BADGER BADGER ');
                    cb(new Buffer(edited));
                };
                helpers.sendModifiedResponse(clientRes, response, transform);
            }
        });
        proxyReq.on('error', function () {
            clientRes.end();
        });
    });
});

proxy.on('error', function (err) {
    console.log(err, err.stack.split('\n'));
});

proxy.listen(5555, 'localhost', function(err) {
    if(err) {
        console.log(err, err.stack.split('\n'));
        process.exit(1);
    }
});
