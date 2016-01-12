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
  certWweCallback
);

cert.generateForHost(
  '*.mbga.jp',
  'google.com, *.google.com, cloudfront.net, *.cloudfront.net, mbga.jp, *.mbga.jp, googleapis.com, *.googleapis.com',
  caCert,
  caKey,
  Math.floor(Date.now() / 1000),
  certJpCallback
)

function certWweCallback(err, pem) {
  fs.writeFileSync(__dirname + '/../cert/wwe.crt', pem.certificate);
  fs.writeFileSync(__dirname + '/../cert/wwe.key', pem.privateKey);
}

function certJpCallback(err, pem) {
  fs.writeFileSync(__dirname + '/../cert/jp.crt', pem.certificate);
  fs.writeFileSync(__dirname + '/../cert/jp.key', pem.privateKey);
}