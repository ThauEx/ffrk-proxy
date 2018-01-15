var fs = require('fs');
var magiciteFilter = require(__dirname + '/../lib/filter/magicite.js');

var json = fs.readFileSync(__dirname + "/get_battle_init_data-magicite.json").toString();
try {
  json = JSON.parse(json);
} catch (e) {
  json = new Function('return ' + json)();
}
json = json.battle.main_beast;

magiciteFilter.update(json);
