var config = require(__dirname + '/../config.js');

exports.update = function(json) {
  var table;
  var rows;

  var enemies = [];
  var dropItemList = [];
  var dropMaterias = [];

  for (var round in json) {
    for (var enemy in json[round].enemy) {
      enemies.push(json[round].enemy[enemy]);
    }

    for (var item in json[round].drop_item_list) {
      dropItemList.push(json[round].drop_item_list[item]);
    }

    for (var materia in json[round].drop_materias) {
      dropMaterias.push(json[round].drop_materias[materia]);
    }
  }

  var lastRound = json.pop();
  lastRound.enemy = enemies;
  lastRound.drop_item_list = dropItemList;
  lastRound.drop_materias = dropMaterias;

  console.log('Merged the enemies from all rounds into a single one.');

  return [lastRound];
};
