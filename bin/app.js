var fs = require('fs');
var http = require('http');

var FFRKProxy = require(__dirname + '/../lib/ffrk-proxy.js');
var buddyFilter = require(__dirname + "/../lib/filter/buddy.js");
var enemyFilter = require(__dirname + "/../lib/filter/enemy.js");
var supporterFilter = require(__dirname + "/../lib/filter/supporter.js")
var info = require(__dirname + '/../package.json');

var certStore = {
  rootCaCert: fs.readFileSync(__dirname + '/../cert/root/rootCA.crt', 'utf8'),
  rootCaKey: fs.readFileSync(__dirname + '/../cert/root/rootCA.key', 'utf8'),
  defaultCaCert: fs.readFileSync(__dirname + '/../cert/wwe.crt', 'utf8'),
  defaultCaKey: fs.readFileSync(__dirname + '/../cert/wwe.key', 'utf8')
};

var proxy = new FFRKProxy(certStore);

proxy.listen(5050, '0.0.0.0', function(err) {
  console.log('ffrk-proxy ' + info.version + ' started');
  console.log('listening on: 0.0.0.0:5050');

  if (err) {
    console.log(err, err.stack.split('\n'));
    process.exit(1);
  }
});

proxy.on('battleInitData', function(json, callback) {
  json.battle.buddy = buddyFilter.update(json.battle.buddy);
  json.battle.rounds = enemyFilter.update(json.battle.rounds);
  json.battle.supporter = supporterFilter.update(json.battle.supporter);
  callback(json);
});

http.createServer(function(request, response) {
  var filePath = __dirname + '/../cert/root/rootCA.crt';
  var stat = fs.statSync(filePath);

  response.writeHead(200, {
    'Content-Type': "application/x-x509-ca-cert",
    'Content-Disposition': 'attachment; filename="rootCa.pem";',
    'Content-Length': stat.size
  });

  var readStream = fs.createReadStream(filePath);

  readStream.pipe(response);
}).listen(5051, '0.0.0.0', function(err) {
  console.log('rootCA webserver started');
  console.log('listening on: 0.0.0.0:5051');

  if (err) {
    console.log(err, err.stack.split('\n'));
    process.exit(1);
  }
});
