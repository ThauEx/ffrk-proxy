var fs = require('fs');
var roundsFilter = require(__dirname + '/../lib/filter/rounds.js');
var enemyFilter = require(__dirname + "/../lib/filter/enemy.js");

var json = fs.readFileSync(__dirname + '/get_battle_init_data-gold_and_item_drop.json').toString();

try {
  json = JSON.parse(json);
} catch (e) {
  json = new Function('return ' + json)();
}

json = json.battle.rounds;
json = enemyFilter.update(json);
json = roundsFilter.update(json);
enemyFilter.update(json);
