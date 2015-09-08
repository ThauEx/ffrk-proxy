/*
  Modify HTML responses, injecting unicorn and rainbow happiness via JavaScript.

  Demonstrates JS injection via the <head> tag with a combination of third-party
  and local script.
 */
var Thin = require('../');
var helpers = require('./helpers');
var http = require('http');
var url = require('url');
var request = require('request');

var proxy = new Thin({
    followRedirect: false,
    strictSSL: false,
    SNICallback: helpers.makeSNICallback()
});

var thirdPartyScripts = {
    '/cornify.js': 'http://www.cornify.com/js/cornify.js'
};
var ourScripts = {
    // Timeout below sets aggressiveness of unicorn spawning...
    '/unicorn_payload.js': 'setInterval(function () { try { cornify_add(); } catch(e) {} }, 5000);'
};

function toScriptTag(path) {
    return '<script type="text/javascript" src="' + path + '"></script>\n';
}

function scriptToInject() {
    return Object.keys(thirdPartyScripts).map(toScriptTag) + Object.keys(ourScripts).map(toScriptTag);
}

/*
  Handle requests for internal payloads. These are served to the client directly (no
  origin-server request is issued).
 */
proxy.use(function(clientReq, clientRes, next) {
    var method = clientReq.method,
        path = url.parse(clientReq.url).path;
    if(method === 'GET' && ourScripts.hasOwnProperty(path)) {
        var payload = ourScripts[path];
        var headers = {
            'content-type': 'text/javascript; charset=UTF-8',
            'content-length': payload.length
        };
        clientRes.writeHead(200, headers);
        clientRes.end(payload);
    } else {
        next(); // Pass the request down the stack.
    }
});

/*
  Handle requests for third-party scripts. We proxy the client's request to the real
  server to keep everything on the same origin and scheme (avoid mixed-content warnings).
 */
proxy.use(function(clientReq, clientRes, next) {
    var method = clientReq.method,
        path = url.parse(clientReq.url).path;
    if(method === 'GET' && thirdPartyScripts.hasOwnProperty(path)) {
        var realUrl = thirdPartyScripts[path];
        console.log('Redirecting request for third-party script: "' + path + '" -> "' + realUrl + '"');
        request.get(realUrl).pipe(clientRes);
    } else {
        next(); // Pass the request down the stack.
    }
});

/*
  Inject script tags into HTML responses before the </head> tag, pass through everything
  else unmodified.

  This middleware does not call next(), because it needs to handle all server responses.
  You can't tell based on the URL what is HTML response content or not. For this reason, it
  needs to be last in the middleware stack.
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
                /*
                  Although not really required (because all scripts are injected into the page's
                  origin), delete CSP & anti-XSS headers from the response anyway.
                 */
                delete response.headers['content-security-policy'];
                delete response.headers['x-content-security-policy'];
                delete response.headers['x-webkit-csp'];
                delete response.headers['x-xss-protection'];

                var transform = function(content, cb) {
                    var edited = content.toString().replace(
                        /<\/\s*head\s*>/i,
                        scriptToInject() + '</head>' + '\n'
                    );
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
