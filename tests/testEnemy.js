var fs = require('fs');
var enemyFilter = require(__dirname + "/../lib/filter/enemy.js");

var json = fs.readFileSync(__dirname + "/../dump/get_battle_init_data2.json").toString();
try {
	json = JSON.parse(json);
} catch (e) {
  json = new Function('return ' + json)();
}
json = json.battle.rounds;

enemyFilter.update(json);
