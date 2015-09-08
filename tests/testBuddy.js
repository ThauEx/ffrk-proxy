var fs = require('fs'),
	buddyFilter = require(__dirname + "/../lib/filter/buddy.js");

var json = fs.readFileSync(__dirname + "/../dump/get_battle_init_data2.json").toString();
try {
	json = JSON.parse(json);
} catch (e) {
    json = new Function('return ' + json)();
}
json = json.battle.buddy;

buddyFilter.update(json);
