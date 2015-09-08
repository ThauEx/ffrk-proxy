var fs = require('fs');

var FFRKProxy = require(__dirname + '/../lib/ffrk-proxy.js');
var buddyFilter = require(__dirname + "/../lib/filter/buddy.js");
var enemyFilter = require(__dirname + "/../lib/filter/enemy.js");

var certStore = {
  rootCaCert: fs.readFileSync(__dirname + '/../cert/root/rootCA.crt', 'utf8'),
  rootCaKey: fs.readFileSync(__dirname + '/../cert/root/rootCA.key', 'utf8'),
  defaultCaCert: fs.readFileSync(__dirname + '/../cert/test.crt', 'utf8'),
  defaultCaKey: fs.readFileSync(__dirname + '/../cert/test.key', 'utf8')
};

var proxy = new FFRKProxy(certStore);

proxy.listen(5050, '0.0.0.0', function(err) {
  console.log('ffrk-proxy started');
  console.log('listening on: 0.0.0.0:5050');

  if (err) {
    console.log(err, err.stack.split('\n'));
    process.exit(1);
  }
});

proxy.on('battleInitData', function(json, callback) {
  json.battle.buddy = buddyFilter.update(json.battle.buddy);
  json.battle.rounds = enemyFilter.update(json.battle.rounds);
  callback(json);
});
