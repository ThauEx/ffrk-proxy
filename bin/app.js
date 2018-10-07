const address = require('address');
const chalk = require('chalk');
const fs = require('fs');
const http = require('http');
const path = require('path');

const config = require('../lib/config');

const FFRKProxy = require('../lib/ffrk-proxy');
const buddyFilter = require('../lib/filter/buddy');
const enemyFilter = require('../lib/filter/enemy');
const supporterFilter = require('../lib/filter/supporter');
const roundsFilter = require('../lib/filter/rounds');
const magiciteFilter = require('../lib/filter/magicite');
const info = require('../package');

const certStore = {
  rootCaCert: fs.readFileSync(__dirname + '/../cert/root/rootCA.crt', 'utf8'),
  rootCaKey: fs.readFileSync(__dirname + '/../cert/root/rootCA.key', 'utf8'),
  defaultCaCert: fs.readFileSync(__dirname + '/../cert/wwe.crt', 'utf8'),
  defaultCaKey: fs.readFileSync(__dirname + '/../cert/wwe.key', 'utf8')
};

const proxy = new FFRKProxy(certStore);

let proxyIp = config.get('application.proxy.ip');
const proxyPort = config.get('application.proxy.port');
let staticIp = config.get('application.cert.ip');
const staticPort = config.get('application.cert.port');

if (proxyIp === '0.0.0.0') {
  proxyIp = address.ip();
}

if (staticIp === '0.0.0.0') {
  staticIp = address.ip();
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
  const urlPath = request.url;
  let filePath;
  let stat;
  let readStream;
  const jsFiles = [
    '/js/inject.js',
    '/js/buddy.js',
    '/js/enemy.js',
    '/js/magicite.js',
    '/js/rounds.js',
    '/js/supporter.js'
  ];

  if (urlPath === '/') {
    filePath = __dirname + '/../cert/root/rootCA.crt';
    stat = fs.statSync(filePath);

    response.writeHead(200, {
      'Content-Type': 'application/x-x509-ca-cert',
      'Content-Disposition': 'attachment; filename="rootCa.pem";',
      'Content-Length': stat.size,
    });

    readStream = fs.createReadStream(filePath);

    readStream.pipe(response);
  } else if (jsFiles.indexOf(urlPath) !== -1) {
    const file = path.parse(urlPath);
    console.log('Injecting: File', file.base);
    filePath = __dirname + '/../public/' + file.base;
    stat = fs.statSync(filePath);

    response.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Content-Length': stat.size,
    });

    readStream = fs.createReadStream(filePath);

    readStream.pipe(response);
  } else if (urlPath === '/proxy.pac') {
    const responseData = 'function FindProxyForURL(url, host) {\n' +
      '   if (shExpMatch(host, \'ffrk.denagames.com\') || shExpMatch(host, \'dff.sp.mbga.jp\')) {\n' +
      '     return \'PROXY ' + proxyIp + ':' + proxyPort + '; DIRECT\';\n' +
      '   }\n' +
      '\n' +
      '   return \'DIRECT\';\n' +
      '}\n';

    response.writeHead(200, {
      'Content-Type': 'application/x-ns-proxy-autoconfig',
      'Content-Length': responseData.length,
    });
   response.end(responseData);
  } else {
    response.writeHead(404);
    response.end();
  }

}).listen(staticPort, staticIp, function(err) {
  const ipPort = staticIp + ':' + staticPort;
  console.log(chalk.black.bgWhite.bold('static webserver') + chalk.black.bgWhite(' started'));
  console.log('listening on: ' + chalk.green(ipPort));
  console.log(chalk.black.bgGreenBright.bold('Enter this url as proxy configuration url http://' + ipPort + '/proxy.pac'));

  if (err) {
    console.log(err, err.stack.split('\n'));
    process.exit(1);
  }
});
