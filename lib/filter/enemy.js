var Table = require('cli-table');
var inventory = require(__dirname + '/../properties/items.json');
var potions = require(__dirname + '/../properties/item_type.json');
var config = require(__dirname + '/../config.js');

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
        var drops = [];
        var currentEnemy = json[round].enemy[enemy].children[part];
        var currentEnemyOri = (JSON.parse(JSON.stringify(currentEnemy)));

        rows.push(currentEnemy.params[0].disp_name);
        rows.push(currentEnemy.lv);
        rows.push(currentEnemy.uid);

        rows.push(currentEnemy.init_hp + '/' + currentEnemy.max_hp);

        currentEnemy.params[0].atk = config.get('enemy.stats.atk') || currentEnemy.params[0].atk;
        rows.push(currentEnemyOri.params[0].atk + '>' + currentEnemy.params[0].atk);

        currentEnemy.params[0].def = config.get('enemy.stats.def') || currentEnemy.params[0].def;
        rows.push(currentEnemyOri.params[0].def + '>' + currentEnemy.params[0].def);

        currentEnemy.params[0].matk = config.get('enemy.stats.matk') || currentEnemy.params[0].matk;
        rows.push(currentEnemyOri.params[0].matk + '>' + currentEnemy.params[0].matk);

        currentEnemy.params[0].mdef = config.get('enemy.stats.mdef') || currentEnemy.params[0].mdef;
        rows.push(currentEnemyOri.params[0].mdef + '>' + currentEnemy.params[0].mdef);

        currentEnemy.params[0].mnd = config.get('enemy.stats.mnd') || currentEnemy.params[0].mnd;
        rows.push(currentEnemyOri.params[0].mnd + '>' + currentEnemy.params[0].mnd);

        currentEnemy.params[0].acc = config.get('enemy.stats.acc') || currentEnemy.params[0].acc;
        rows.push(currentEnemyOri.params[0].acc + '>' + currentEnemy.params[0].acc);

        currentEnemy.params[0].eva = config.get('enemy.stats.eva') || currentEnemy.params[0].eva;
        rows.push(currentEnemyOri.params[0].eva + '>' + currentEnemy.params[0].eva);

        currentEnemy.params[0].spd = config.get('enemy.stats.spd') || currentEnemy.params[0].spd;
        rows.push(currentEnemyOri.params[0].spd + '>' + currentEnemy.params[0].spd);

        var buffs = '';
        if (config.get('enemy.defAttributes.enabled')) {
          currentEnemy.params[0].def_attributes = config.get('enemy.defAttributes.attributes');

          if (currentEnemy.params[0].def_attributes.length == 0) {
            buffs = 'Debuffed';
          } else {
            buffs = currentEnemy.params[0].def_attributes.join(', ');
          }
        }

        rows.push(buffs);

        table.push(rows);

        if (currentEnemy.drop_item_list.length > 0) {
          for (var itemIndex in currentEnemy.drop_item_list) {
            var item = currentEnemy.drop_item_list[itemIndex];

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

    if (json[round].drop_materias && json[round].drop_materias.length > 0) {
      process.stdout.write('   Materia: ');
      for (var itemIndex in json[round].drop_materias) {
        var item = json[round].drop_materias[itemIndex];
        console.log('\\RM: ' + item.name + '(' + item.description + ')');
      }
    }
  }

  return json;
};
