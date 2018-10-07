const Table = require('cli-table');
const inventory = require('../properties/items');
const potions = require('../properties/item_type');
const config = require('../config');

exports.update = function(json) {
  let table;
  let rows;

  for (let round in json) {
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
        'weakness',
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

    for (let enemy in json[round].enemy) {
      for (let part in json[round].enemy[enemy].children) {
        let buffs;
        rows = [];
        const drops = [];
        const currentEnemy = json[round].enemy[enemy].children[part];
        const currentEnemyOri = (JSON.parse(JSON.stringify(currentEnemy)));

        rows.push(currentEnemy.params[0].disp_name);
        rows.push(currentEnemy.lv);
        rows.push(currentEnemy.uid);

        currentEnemy.init_hp = config.get('enemy.stats.hp') || currentEnemy.init_hp;
        currentEnemy.max_hp = config.get('enemy.stats.hp') || currentEnemy.max_hp;

        for (let param in json[round].enemy[enemy].children[part].params) {
          currentEnemy.params[param].atk = config.get('enemy.stats.atk') || currentEnemy.params[param].atk;
          currentEnemy.params[param].def = config.get('enemy.stats.def') || currentEnemy.params[param].def;
          currentEnemy.params[param].matk = config.get('enemy.stats.matk') || currentEnemy.params[param].matk;
          currentEnemy.params[param].mdef = config.get('enemy.stats.mdef') || currentEnemy.params[param].mdef;
          currentEnemy.params[param].mnd = config.get('enemy.stats.mnd') || currentEnemy.params[param].mnd;
          currentEnemy.params[param].acc = config.get('enemy.stats.acc') || currentEnemy.params[param].acc;
          currentEnemy.params[param].eva = config.get('enemy.stats.eva') || currentEnemy.params[param].eva;
          currentEnemy.params[param].spd = config.get('enemy.stats.spd') || currentEnemy.params[param].spd;

          buffs = '';

          if (config.get('enemy.defAttributes.enabled')) {
            const newDefAttr = [];
            const displayAttr = [];

            for (let att in json[round].enemy[enemy].children[part].params[param].def_attributes) {
              const attributes = json[round].enemy[enemy].children[part].params[param].def_attributes[att];

              if (attributes.attribute_id < 200 && attributes.factor === 1) {
                newDefAttr.push(attributes);
                switch (attributes.attribute_id) {
                  case '100':
                    displayAttr.push('Fire');
                    break;
                  case '101':
                    displayAttr.push('Ice');
                    break;
                  case '102':
                    displayAttr.push('Thunder');
                    break;
                  case '103':
                    displayAttr.push('Earth');
                    break;
                  case '104':
                    displayAttr.push('Wind');
                    break;
                  case '105':
                    displayAttr.push('Water');
                    break;
                  case '106':
                    displayAttr.push('Holy');
                    break;
                  case '107':
                    displayAttr.push('Dark');
                    break;
                  default:
                    displayAttr.push('Poison');
                    break;
                }
              }
            }
            currentEnemy.params[param].def_attributes = newDefAttr;
            buffs = displayAttr;

            if (currentEnemy.params[0].def_attributes.length !== 0) {
              buffs = displayAttr;
            }
          }
        }
        rows.push(currentEnemyOri.init_hp + '/' + currentEnemyOri.max_hp + '>' + currentEnemy.init_hp + '/' + currentEnemy.max_hp);
        rows.push(currentEnemyOri.params[0].atk + '>' + currentEnemy.params[0].atk);
        rows.push(currentEnemyOri.params[0].def + '>' + currentEnemy.params[0].def);
        rows.push(currentEnemyOri.params[0].matk + '>' + currentEnemy.params[0].matk);
        rows.push(currentEnemyOri.params[0].mdef + '>' + currentEnemy.params[0].mdef);
        rows.push(currentEnemyOri.params[0].mnd + '>' + currentEnemy.params[0].mnd);
        rows.push(currentEnemyOri.params[0].acc + '>' + currentEnemy.params[0].acc);
        rows.push(currentEnemyOri.params[0].eva + '>' + currentEnemy.params[0].eva);
        rows.push(currentEnemyOri.params[0].spd + '>' + currentEnemy.params[0].spd);
        rows.push(buffs);

        table.push(rows);

        if (currentEnemy.drop_item_list.length > 0) {
          for (let itemIndex in currentEnemy.drop_item_list) {
            const item = currentEnemy.drop_item_list[itemIndex];

            if (item.type === 11) {
              drops.push('Gold: ' + item.amount);
            } else if (item.type === 61) {
              drops.push('Gysahl Greens: ' + item.num);
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
      console.log(' Round Drops (Potions): ');
      for (let itemIndex in json[round].drop_item_list) {
        const item = json[round].drop_item_list[itemIndex];
        console.log(potions[item.type]);
      }
    }

    if (json[round].drop_materias && json[round].drop_materias.length > 0) {
      console.log('   Materia: ');
      for (let itemIndex in json[round].drop_materias) {
        const item = json[round].drop_materias[itemIndex];
        console.log('\\RM: ' + item.name + '(' + item.description + ')');
      }
    }
  }

  return json;
};
