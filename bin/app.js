var address = require('address');
var chalk = require('chalk');
var fs = require('fs');
var http = require('http');

var config = require(__dirname + '/../lib/config.js');

var FFRKProxy = require(__dirname + '/../lib/ffrk-proxy.js');
var buddyFilter = require(__dirname + '/../lib/filter/buddy.js');
var enemyFilter = require(__dirname + '/../lib/filter/enemy.js');
var supporterFilter = require(__dirname + '/../lib/filter/supporter.js')
var roundsFilter = require(__dirname + '/../lib/filter/rounds.js');
var magiciteFilter = require(__dirname + '/../lib/filter/magicite.js');
var info = require(__dirname + '/../package.json');

var certStore = {
  rootCaCert: fs.readFileSync(__dirname + '/../cert/root/rootCA.crt', 'utf8'),
  rootCaKey: fs.readFileSync(__dirname + '/../cert/root/rootCA.key', 'utf8'),
  defaultCaCert: fs.readFileSync(__dirname + '/../cert/wwe.crt', 'utf8'),
  defaultCaKey: fs.readFileSync(__dirname + '/../cert/wwe.key', 'utf8')
};

var proxy = new FFRKProxy(certStore);

var proxyIp = config.get('application.proxy.ip');
var proxyPort = config.get('application.proxy.port');
var certIp = config.get('application.cert.ip');
var certPort = config.get('application.cert.port');

if (proxyIp === '0.0.0.0') {
  proxyIp = address.ip();
}

if (certIp === '0.0.0.0') {
  certIp = address.ip();
}

proxy.listen(proxyPort, proxyIp, function(err) {
  console.log(chalk.black.bgWhite.bold('ffrk-proxy') + chalk.black.bgWhite(' ' + info.version + ' started'));
  console.log('listening on: ' + chalk.green(proxyIp + ':' + proxyPort));

  if (err) {
    console.log(err, err.stack.split('\n'));
    process.exit(1);
  }
});

proxy.on('battleInitData', function(json, callback) {
  json.battle.main_beast = magiciteFilter.update(json.battle.main_beast);
  json.battle.buddy = buddyFilter.update(json.battle.buddy);
  json.battle.rounds = enemyFilter.update(json.battle.rounds);
  json.battle.supporter = supporterFilter.update(json.battle.supporter);

  if (config.get('rounds.shortRounds.enabled')) {
    json.battle.rounds = roundsFilter.update(json.battle.rounds);
  }
  callback(json);
});

http.createServer(function(request, response) {
  var filePath = __dirname + '/../cert/root/rootCA.crt';
  var stat = fs.statSync(filePath);

  response.writeHead(200, {
    'Content-Type': 'application/x-x509-ca-cert',
    'Content-Disposition': 'attachment; filename="rootCa.pem";',
    'Content-Length': stat.size,
  });

  var readStream = fs.createReadStream(filePath);

  readStream.pipe(response);
}).listen(certPort, certIp, function(err) {
  console.log(chalk.black.bgWhite.bold('rootCA webserver') + chalk.black.bgWhite(' started'));
  console.log('listening on: ' + chalk.green(certIp + ':' + certPort));

  if (err) {
    console.log(err, err.stack.split('\n'));
    process.exit(1);
  }
});
