var Table = require('cli-table');
var ailments = require(__dirname + '/../properties/ailments.json');
var atkType = require(__dirname + '/../properties/atk_type.json');
var config = require(__dirname + '/../config.js');

exports.update = function(json) {
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
      'mnd',
      'acc',
      'eva',
      'spd',
      'atk_type',
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
    }
  });

  for (var buddy in json) {
    var tmpRow = [];
    var tmp = 0;

    var atkAttributeDesc = []
    var statusAilmentDesc = []
    var params = json[buddy].params[0];

    tmpRow.push(params.disp_name);
    tmpRow.push(json[buddy].id);
    tmpRow.push(json[buddy].no);

    /**
     * Refill HP every round, also has unintentional beneficial side effect of raising dead party members between rounds.
     */
    tmp = json[buddy].init_hp;
    json[buddy].init_hp = parseInt(json[buddy].max_hp);
    tmpRow.push(tmp + '/' + json[buddy].max_hp);

    params.atk = config.get('buddy.stats.atk') || params.atk;
    tmpRow.push(params.atk);

    params.def = config.get('buddy.stats.def') || params.def;
    tmpRow.push(params.def);

    params.matk = config.get('buddy.stats.matk') || params.matk;
    tmpRow.push(params.matk);

    params.mdef = config.get('buddy.stats.mdef') || params.mdef;
    tmpRow.push(params.mdef);

    params.mnd = config.get('buddy.stats.mnd') || params.mnd;
    tmpRow.push(params.mnd);

    params.acc = config.get('buddy.stats.acc') || params.acc;
    tmpRow.push(params.acc);

    params.eva = config.get('buddy.stats.eva') || params.eva;
    tmpRow.push(params.eva);

    params.spd = config.get('buddy.stats.spd') || params.spd;
    tmpRow.push(params.spd);

    /**
     * Attack type
     */
    params.atk_type = atkType[config.get('buddy.attack.type')].id || params.atk_type;
    tmpRow.push(atkType[config.get('buddy.attack.type')].description);

    /**
     * Attack attributes
     */
    for (var attrIndex in config.get('buddy.attack.attributes')) {
      var attribute = config.get('buddy.attack.attributes')[attrIndex];

      params.atk_attributes.push({
        attribute_id: ailments[attribute].id,
        factor: 100,
      });
      atkAttributeDesc.push(ailments[attribute].description);
    };

    /**
     * Start round with following status ailments
     */
    for (var statusIndex in config.get('buddy.status')) {
      var status = config.get('buddy.status')[statusIndex];

      json[buddy].status_ailments.push(ailments[status].id);
      statusAilmentDesc.push(ailments[status].description);
    };

    /**
     * Quick attack
     * Does not work under normal attack.
     * Works under RM changed attacks and every ability
     */
    if (config.get('buddy.attack.quickAttack')) {
      for (var ability in json[buddy].abilities) {
        json[buddy].abilities[ability].options.cast_time = '100';
      }
    }

    /**
     * Ability spammer
     * Fills soulbreak gauge one full unit per ability
     * Number of uses set to 20, setting to '0' (infinity) creates bugs, and they refill every round of a stage
     */
    if (config.get('buddy.attack.abilitySpammer')) {
      for (var panel in json[buddy].ability_panels) {
        if (json[buddy].ability_panels[panel].ability_id != '30151001') {
          json[buddy].ability_panels[panel].num = '20';
          json[buddy].ability_panels[panel].max_num = '20';
        }

        json[buddy].ability_panels[panel].ability_ss_point = '500'
      }
    }

    /**
     * Soul strike spammer
     * Allows all soul strikes to be instant-cast
     * Makes them cost 1/500th of a soul gauge. (Normal cost is 500, new cost is one per soul break.)
     */
    if (config.get('buddy.attack.soulStrikeSpammer')) {
      for (var sStrike in json[buddy].soul_strikes) {
        json[buddy].soul_strikes[sStrike].options.cast_time = '100';
        json[buddy].soul_strikes[sStrike].options.consume_soul_strike_point = '1';
      }

      // Starts each new round with a full soul gauge
      json[buddy].soul_strike_gauge = '1500'
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
