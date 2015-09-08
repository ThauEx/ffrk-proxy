/// <reference path="../typings/node/node.d.ts"/>
var Proxy = require('http-mitm-proxy'),
	proxy = Proxy(),
	path = require('path'),
	fs = require('fs'),
	cert = require(__dirname + '/../lib/cert.js');

var buddyFilter = require(__dirname + "/../lib/filter/buddy.js");

var rootCACert = fs.readFileSync(__dirname + "/../cert/root/rootCA.crt"),
	rootCAKey = fs.readFileSync(__dirname + "/../cert/root/rootCA.key");

process.on('uncaughtException', function (err) {
	console.log(err);
})

proxy.onError(function (context, err) {
	console.error('proxy error:', err);
});

proxy.onRequest(function (context, callback) {
	console.log("Requested: " + context.clientToProxyRequest.url);
	if (context.clientToProxyRequest.headers.host == 'ffrk.denagames.com') {
		if (context.clientToProxyRequest.url.indexOf('get_battle_init_data') > -1) {
			var chunks = [];
			context.use(Proxy.gunzip);

			context.onResponseData(function (context, chunk, callback) {
				chunks.push(chunk);
			});

			context.onResponseEnd(function (ctx, chunk, callback) {
				var buffer = Buffer.concat(chunks);
				var json = buffer.toString();

				//fs.writeFileSync(__dirname + "/dump/get_battle_init_data-" + Date.now() + ".json", json);

				try {
					json = JSON.parse(json);
				} catch (e) {
					json = new Function('return ' + json)();
				}

				var buddyJson = json.battle.buddy;
				json.battle.buddy = buddyFilter.update(buddyJson);

				var newChunks = new Buffer(JSON.stringify(json));

				return callback(null, newChunks);
			});
		}
	}

	return callback();
});

proxy.onCertificateRequired  = function (hostname, callback) {
	var certPath = path.resolve('./cert/', hostname + '.crt');
	var keyPath = path.resolve('./cert/', hostname + '.key');
	var pem = cert.generateForHost(hostname, rootCACert.toString(), rootCAKey.toString());

	//TODO: refactor me async!
	fs.writeFileSync(certPath, pem.certificate);
	fs.writeFileSync(keyPath, pem.privateKey);

	return callback(null, {
		certFile: path.resolve('./cert/', hostname + '.crt'),
		keyFile: path.resolve('./cert/', hostname + '.key')
	});
};

proxy.listen({
	port: 5050
});
