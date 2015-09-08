var fs = require('fs');
var cert = require(__dirname + '/../lib/cert.js');

var caCert = fs.readFileSync(__dirname + '/../cert/root/rootCA.crt', 'utf8');
var caKey = fs.readFileSync(__dirname + '/../cert/root/rootCA.key', 'utf8');

cert.generateForHost(
    '*.denagames.com',
    'google.com, *.google.com, cloudfront.net, *.cloudfront.net, denagames.com, *.denagames.com, googleapis.com, *.googleapis.com',
    caCert,
    caKey,
    Math.floor(Date.now() / 1000),
    certCallback
)

function certCallback(err, pem) {
    fs.writeFileSync(__dirname + '/../cert/test.crt', pem.certificate);
	fs.writeFileSync(__dirname + '/../cert/test.key', pem.privateKey);
}
