/**
 * Original code by ThauEx
 * Modified by /u/mba199
 */

var Table = require('cli-table');
var inventory = require(__dirname + '/../properties/items.json');
var potions = require(__dirname + '/../properties/item_type.json');

exports.update = function(json) {
  var table;
  var rows;

  for (var round in json) {
    table = new Table({
      head: [
        'Round: ' + (parseInt(round) + 1),
        'lvl',
        'uid',
        'HP',
        'atk',
        'def',
        'matk',
        'mdef',
        'mnd',
        'acc',
        'eva',
        'spd',
        'extra',
        'drops',
      ],
      chars: {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: ' ',
      },
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
      
        rows.push(json[round].enemy[enemy].children[part].params[0].mnd + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].mnd = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].acc + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].acc = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].eva + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].eva = 1;

        rows.push(json[round].enemy[enemy].children[part].params[0].spd + '>' + 1);
        json[round].enemy[enemy].children[part].params[0].spd = 1;

        json[round].enemy[enemy].children[part].params[0].def_attributes = [];
        rows.push('Debuffed');

        table.push(rows);

        var drops = [];
        if (json[round].enemy[enemy].children[part].drop_item_list.length > 0) {
          for (var itemIndex in json[round].enemy[enemy].children[part].drop_item_list) {
            var item = json[round].enemy[enemy].children[part].drop_item_list[itemIndex];
            if (item.type == 11) {
              drops.push('Gold: ' + item.amount);
            } else {
              drops.push(inventory[item.item_id] + ' (' + item.rarity + '*)');
            }
          }
         }

        rows.push(drops.join(', '));
      }
    }

    console.log('\n' + table.toString());

    /*
     * Drops like potions and others
     */
    if (json[round].drop_item_list.length > 0) {
      process.stdout.write(' Round Drops (Potions): ');
      for (var itemIndex in json[round].drop_item_list) {
        var item = json[round].drop_item_list[itemIndex];
        console.log(potions[item.type]);
      }
    }

    if (json[round].drop_materias.length > 0) {
      process.stdout.write('   Materia: ');
      for (var itemIndex in json[round].drop_materias) {
        var item = json[round].drop_materias[itemIndex];
        console.log('\\RM: '+ item.name + '(' + item.description + ')');
      }
    }
  }

  return json;
};
