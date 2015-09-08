/**
 * Original code by ThauEx
 * Modified by /u/mba199
 */

var Table = require('cli-table');
var ailments = require(__dirname + '/../properties/ailments.json');
var atkType = require(__dirname + '/../properties/atk_type.json');
var config = GLOBAL.config;

exports.update = function (json) {
  var table = new Table({
    head: [
      'Name',
      'id',
      'no',
      'HP',
      'atk',
      'def',
      'matk',
      'mdef',
      'acc',
      'eva',
      'spd',
      'atk_type'
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

  for (var buddy in json) {
    var tmpRow = [];
    var tmp = 0;

    var atkAttributeDesc = []
    var statusAilmentDesc = []

    tmpRow.push(json[buddy].params[0].disp_name);
    tmpRow.push(json[buddy].id);
    tmpRow.push(json[buddy].no);

    tmp = json[buddy].init_hp;
    json[buddy].init_hp = parseInt(json[buddy].init_hp);
    tmpRow.push(tmp + '/' + json[buddy].max_hp);

    json[buddy].params[0].atk = config.buddy.stats.atk;
    tmpRow.push(json[buddy].params[0].atk);

    json[buddy].params[0].def = config.buddy.stats.def;
    tmpRow.push(json[buddy].params[0].def);

    json[buddy].params[0].matk = config.buddy.stats.matk;
    tmpRow.push(json[buddy].params[0].matk);

    json[buddy].params[0].mdef = config.buddy.stats.mdef;
    tmpRow.push(json[buddy].params[0].mdef);

    json[buddy].params[0].acc = config.buddy.stats.acc;
    tmpRow.push(json[buddy].params[0].acc);

    json[buddy].params[0].eva = config.buddy.stats.eva;
    tmpRow.push(json[buddy].params[0].eva);

    json[buddy].params[0].spd = config.buddy.stats.spd;
    tmpRow.push(json[buddy].params[0].spd);

    /**
     * All attacks ranged
     */
    json[buddy].params[0].atk_type = atkType[config.buddy.attack.type];
    tmpRow.push(config.buddy.attack.type);

    /**
     * Atk attributes
     */
     config.buddy.attack.attributes.forEach(function(attribute) {
       json[buddy].params[0].atk_attributes.push(
         {attribute_id: ailments[attribute].id, factor: 100}
       );
       atkAttributeDesc.push(ailments[attribute].description);
     });

    /**
     * Start round with following stats
     * @see comment below
     */
    config.buddy.status.forEach(function(status) {
      json[buddy].status_ailments.push(ailments[status].id);
      statusAilmentDesc.push(ailments[status].description);
    });

    /**
     * Changes attacks
     */
    // Hits everyone - Seems to not work
    json[buddy].abilities[0].options.target_method = 6;

    /*
     * Quick attack
     * Does not work under normal attack.
     * Works under RM changed attacks and every ability
     */
    for (var ability in json[buddy].abilities) {
      json[buddy].abilities[ability].options.cast_time = '100';
    }

    table.push(tmpRow);
  }

  console.log(table.toString());
  console.log('atk attributes:\n', atkAttributeDesc.join(', '));
  console.log('status ailments:\n', statusAilmentDesc.join(', '));

  return json;
};

/**
 * Ailments ID: (status_ailments_id)
 *
 * Record Materia (Effect Type)
 * 2 - Mana spring II (arg1 = 1, arg3 = 100, arg2 = 4), Concentration II (arg1 = 1, arg3 = 100, arg2 = 3)
 * 7 - Atunnement (Increase damage on weakness to arg1)
 * 12 - Chance to counter (arg1 = 15, arg2 = 3, arg4 = 100, arg3 = 1)
 * 13 - Zealot/Barrage (arg1 = 100/16, arg2 = 30501011/30151111 [Creates new 3rd ability that carries the stats])
 *
 * Element ID: (arg2)
 * 100 - Fire
 * 101 - Blizzard
 * 102 - Thunder
 * 103 - Earth
 * 104 - Wind
 * 105 - Water
 * 106 - Cure
 * 107 - Dark
 * 108 - Poison
 * 199 - Non-Elemental
 */
