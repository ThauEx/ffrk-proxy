exports.update = function(json) {
  const dropItemList = [];
  const dropMaterias = [];

  for (let round in json) {
    for (let item in json[round].drop_item_list) {
      dropItemList.push(json[round].drop_item_list[item]);
    }

    for (let materia in json[round].drop_materias) {
      dropMaterias.push(json[round].drop_materias[materia]);
    }
  }

  const lastRound = json.pop();
  lastRound.drop_item_list = dropItemList;
  lastRound.drop_materias = dropMaterias;

  console.log('Merged the enemies from all rounds into a single one.');

  return [lastRound];
};
