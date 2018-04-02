exports.update = function(json) {
  var dropItemList = [];
  var dropMaterias = [];

  for (var round in json) {
    for (var item in json[round].drop_item_list) {
      dropItemList.push(json[round].drop_item_list[item]);
    }

    for (var materia in json[round].drop_materias) {
      dropMaterias.push(json[round].drop_materias[materia]);
    }
  }

  var lastRound = json.pop();
  lastRound.drop_item_list = dropItemList;
  lastRound.drop_materias = dropMaterias;

  console.log('Merged the enemies from all rounds into a single one.');

  return [lastRound];
};
