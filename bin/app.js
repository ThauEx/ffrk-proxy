/// <reference path="../typings/node/node.d.ts"/>
var Proxy = require('thin'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    cert = require(__dirname + '/../lib/cert.js'),
    helpers = require(__dirname + '/../lib/helpers.js');

var buddyFilter = require(__dirname + "/../lib/filter/buddy.js");

var proxy = new Proxy({
    followRedirect: true,
    strictSSL: false,
    rejectUnauthorized: false,
    SNICallback: helpers.makeSNICallback()
});

proxy.use(function(clientReq, clientRes, next) {
    var reqUrl = clientReq.url;
    if (clientReq.connection.encrypted) {
        reqUrl = 'https://' + clientReq.headers.host + reqUrl;
    }
    console.log('Proxying:', reqUrl);

    proxy.forward(clientReq, clientRes, function(proxyReq) {
        proxyReq.on('response', function (response) {
            if (clientReq.headers.host == 'ffrk.denagames.com') {
        		if (clientReq.url.indexOf('get_battle_init_data') > -1) {
                    var transform = function(content, cb) {
                        try {
                            json = JSON.parse(content);
                        } catch (e) {
                            json = new Function('return ' + content)();
                        }

                        var buddyJson = json.battle.buddy;
                        json.battle.buddy = buddyFilter.update(buddyJson);

                        cb(new Buffer(JSON.stringify(json)));
                    }

                    helpers.sendModifiedResponse(clientRes, response, transform);
                } else {
                    helpers.sendOriginalResponse(clientRes, response);
                }
            } else {
                helpers.sendOriginalResponse(clientRes, response);
            }
        });
        proxyReq.on('error', function (err) {
            console.error(err, err.stack.split('\n'));
            clientRes.end();
        });
    });
});

proxy.on('error', function (err) {
    console.error(err, err.stack.split('\n'));
});

proxy.listen(5050, '0.0.0.0', function(err) {
    if(err) {
        console.log(err, err.stack.split('\n'));
        process.exit(1);
    }
});

http.createServer(function(request, response) {
    var filePath = path.join(__dirname, '..', 'cert', 'root', 'rootCA.crt');
    var stat = fs.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': "application/x-x509-ca-cert",
        'Content-Disposition': 'attachment; filename="rootCa.pem";',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);

    readStream.pipe(response);
}).listen(5051);
