/// <reference path="../typings/node/node.d.ts"/>
var Proxy = require('thin');
var path = require('path');
var fs = require('fs');
var http = require('http');
var cert = require(__dirname + '/../lib/cert.js');
var helpers = require(__dirname + '/../lib/helpers.js');

var buddyFilter = require(__dirname + "/../lib/filter/buddy.js");
var enemyFilter = require(__dirname + "/../lib/filter/enemy.js");

var caCert = fs.readFileSync(__dirname + '/../cert/root/rootCA.crt', 'utf8');
var caKey = fs.readFileSync(__dirname + '/../cert/root/rootCA.key', 'utf8');

var testCert = fs.readFileSync(__dirname + '/../cert/test.crt', 'utf8');
var testKey = fs.readFileSync(__dirname + '/../cert/test.key', 'utf8');

var proxy = new Proxy({
    followRedirect: true,
    strictSSL: false,
    rejectUnauthorized: false,
    SNICallback: helpers.makeSNICallback(caCert, caKey),
    key: testKey,
    cert: testCert
});

proxy.use(function(clientReq, clientRes, next) {
    var reqUrl = clientReq.url;
    if (clientReq.connection.encrypted) {
        reqUrl = 'https://' + clientReq.headers.host + reqUrl;
    }
    console.log('Proxying:', clientReq.method, reqUrl);
    proxy.forward(clientReq, clientRes, function(proxyReq) {
        proxyReq.on('response', function (response) {
            if (clientReq.headers.host == 'ffrk.denagames.com') {
        		if (clientReq.url.indexOf('get_battle_init_data') > -1) {
                    var transform = function(content, cb) {
                        fs.writeFile(__dirname + "/../dump/get_battle_init_data-" + process.hrtime() + ".json", content, function (err) {
                            if (err) {
                                console.error('Failed to write "get_battle_init_data" dump');
                            }
                        });

                        try {
                            json = JSON.parse(content);
                        } catch (e) {
                            json = new Function('return ' + content)();
                        }

                        json.battle.buddy = buddyFilter.update(json.battle.buddy);
                        json.battle.rounds = enemyFilter.update(json.battle.rounds);

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
    console.log('ffrk-proxy started');
    console.log('listening on: 0.0.0.0:5050');
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
