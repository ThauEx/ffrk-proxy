/**
 * Original code by ThauEx
 * Modified by /u/mba199
 */

var Table = require('cli-table');

exports.update = function (json) {
  var table, rows;

  for (var round in json) {
    table = new Table({
      head: [
        'Round: ' + (parseInt(round)+1),
        'lvl',
        'uid',
        'HP',
        'atk',
        'def',
        'matk',
        'mdef',
        'acc',
        'eva',
        'spd',
        'extra'
      ],
      chars: {
        'top': '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        'bottom': '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        'left': '',
        'left-mid': '',
        'mid': '',
        'mid-mid': '',
        'right': '',
        'right-mid': '',
        'middle': ' '
      }
    });

    for (var enemy in json[round].enemy) {
      for (var part in json[round].enemy[enemy].children) {
        var rows = [];

        rows.push(json[round].enemy[enemy].children[part].params[0].disp_name);
        rows.push(json[round].enemy[enemy].children[part].lv);
        rows.push(json[round].enemy[enemy].children[part].uid);

        rows.push(json[round].enemy[enemy].children[part].init_hp + '/' +
          json[round].enemy[enemy].children[part].max_hp);

        rows.push(json[round].enemy[enemy].children[part].params[0].atk + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].atk = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].def + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].def = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].matk + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].matk = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].mdef + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].mdef = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].acc + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].acc = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].eva + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].eva = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].spd + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].spd = 1;

        json[round].enemy[enemy].children[part].params[0].def_attributes = [];
        rows.push('Debuffed');

        table.push(rows);
      }
    }

    console.log(table.toString());

    /*
     * Drops like potions and others
     */
    /*
    if (json[round].drop_item_list.length > 0) {
      console.log('Drops:');
      for (var item in json[round].drop_item_list) {
        console.log(
          '\\type: ' + json[round].drop_item_list[item].type,
          '- round: : ' + json[round].drop_item_list[item].round,
          '- rarity: : ' + json[round].drop_item_list[item].rarity
        );
      }
    }
    */

    if (json[round].drop_materias.length > 0) {
      console.log('Materia:');
      for (var item in json[round].drop_materias) {
        console.log(
          '\\RM: '+json[round].drop_materias[item].name,
          '- '+json[round].drop_materias[item].description
        );
      }
    }
  }

  return json;
};
