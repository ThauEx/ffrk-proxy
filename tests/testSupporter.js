var fs = require('fs');
var supporterFilter = require(__dirname + '/../lib/filter/supporter.js');

var json = fs.readFileSync(__dirname + "/get_battle_init_data-morphing_boss.json").toString();
try {
  json = JSON.parse(json);
} catch (e) {
  json = new Function('return ' + json)();
}
json = json.battle.supporter;

supporterFilter.update(json);
