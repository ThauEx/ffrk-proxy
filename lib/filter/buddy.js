/**
 * Original code by ThauEx
 * Modified by /u/mba199
 * Modified again on 11/8/2015 by SirPhoenix88
 * Modified on 1/12/2016 by SirPhoenix88
 * Modified on 2/1/2016 by SirPhoenix88 
 */

var Table = require('cli-table');

exports.update = function (json) {
  var atkType = {
    'normal': 1,
    'ranged': 2
  };

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
      'atk_type',
      'effect'
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

    tmpRow.push(json[buddy].params[0].disp_name);
    tmpRow.push(json[buddy].id);
    tmpRow.push(json[buddy].no);
    
    /**
     * Refill HP every round, also has unintentional beneficial side effect of raising dead party members between rounds. 
     */
    tmp = json[buddy].init_hp;
    json[buddy].init_hp = parseInt(json[buddy].max_hp);
    tmpRow.push(tmp + '/' + json[buddy].max_hp);

    tmp = json[buddy].params[0].atk;
    json[buddy].params[0].atk = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].atk);

    tmp = json[buddy].params[0].def;
    json[buddy].params[0].def = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].def);

    tmp = json[buddy].params[0].matk;
    json[buddy].params[0].matk = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].matk);

    tmp = json[buddy].params[0].mdef;
    json[buddy].params[0].mdef = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].mdef);

    tmp = json[buddy].params[0].acc;
    json[buddy].params[0].acc = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].acc);

    tmp = json[buddy].params[0].eva;
    json[buddy].params[0].eva = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].eva);

    tmp = json[buddy].params[0].spd;
    json[buddy].params[0].spd = 9999;
    tmpRow.push(/*tmp + '/'*/ + json[buddy].params[0].spd);

    /**
     * All attacks ranged
     */
    tmp = json[buddy].params[0].atk_type;
    var selectedAtkType = 'ranged';
    json[buddy].params[0].atk_type = atkType[selectedAtkType];
    tmpRow.push(selectedAtkType);

    /**
     * Atk attributes
     */
    json[buddy].params[0].atk_attributes = [
      {attribute_id: '200', factor: 100},     // Poison
      {attribute_id: '201', factor: 100},     // Silence
      {attribute_id: '202', factor: 100},     // Paralyze
      {attribute_id: '203', factor: 100},     // Confuse
      {attribute_id: '205', factor: 100},     // Slow
      {attribute_id: '206', factor: 100},     // Stop?
      {attribute_id: '210', factor: 100},     // Blind
      {attribute_id: '211', factor: 100},     // Sleep
      // {attribute_id: '212', factor: 100},   // Petrify
      {attribute_id: '213', factor: 100},     // Doom
      // {attribute_id: '214', factor: 100},   // Death
      {attribute_id: '215', factor: 100},     // Berserk
      {attribute_id: '229', factor: 100},     // Sap
    ];

    /**
     * Start round with following stats
     * @see comment below
     */
    json[buddy].status_ailments = [204, 207, 208, 243, 508, 509, 523];

    /**
     * Changes attacks
     */
    // Hits everyone - Seems to not work
    json[buddy].abilities[0].options.target_method = 6;
    for (var ability in json[buddy].abilities) {
      /*
       * Quick attack
       * Does not work under normal attack.
       * Works under RM changed attacks and every ability
       */
      json[buddy].abilities[ability].options.cast_time = '100';
    }
    /*
     * Ability spammer
     * Fills soulbreak gauge one full unit per ability
     * Number of uses set to 20, setting to '0' (infinity) creates bugs, and they refill every round of a stage
     */
    for (var panel in json[buddy].ability_panels) {
      if (json[buddy].ability_panels[panel].ability_id != '30151001') {
        json[buddy].ability_panels[panel].num = '20';
        json[buddy].ability_panels[panel].max_num = '20';
      }
      json[buddy].ability_panels[panel].ability_ss_point = '500'
    }
    /*
     * Soul strike spammer
     * Allows all soul strikes to be instant-cast
     * Makes them cost 1/500th of a soul gauge. (Normal cost is 500, new cost is one per soul break.)
     */
    for (var sStrike in json[buddy].soul_strikes) {
      json[buddy].soul_strikes[sStrike].options.cast_time = '100';
      json[buddy].soul_strikes[sStrike].options.consume_soul_strike_point = '1';
    }
    
    // Starts each new round with a full soul gauge
    json[buddy].soul_strike_gauge = '1500'
    tmpRow.push('Buffs + Bad Breath + Quick Hit');
    table.push(tmpRow);
  }

  console.log(table.toString());

  return json;
};

/**
 * Ailments ID: (status_ailments_id)
 *
 * 0   - null
 * 200 - Poison
 * 201 - Silence
 * 202 - Paralyze
 * 203 - Confuse
 * 204 - Haste
 * 205 - Slow
 * 206 - Stop
 * 207 + Protect / Def+100%
 * 208 + Shell / Mdef+100%
 * 209 + Reflect
 * 210 - Blind
 * 211 - Sleep
 * 212 - Petrify
 * 213 - Doom
 * 214 - Death
 * 215 - Berserk / Atk+25%
 * 216 - Regen
 * 229 - Sap
 * 240 - Triple / Matk+25%
 * 243 - Strong Regen
 *
 * 501 - Matk Booster / Matk+25%
 * 502 - Provoke + Sentinel (Pala Cecil) / Def+200%
 * 503 - Charge / Atk+200%
 * 508 - Retaliate
 * 509 - Runic (Celes)
 * 513 - Advance (Luneth) / Atk+150%, Def-50%
 * 515 - Overdrive ? / Atk+30%, DefMdef-30%
 * 515 - Roar / AtkMatk+20%, DefMdef-20%
 * 522 - Charm - Taunt (Knight) / Def+100%
 * 523 - Mighty Guard (Dodge one spell/Kimarhi's unique soul break)
 * 526 - Indomitableness / Atk+50%
 * 527 - Magic Charm - Magical Taunt (Knight) / MDef+100%
 * 528 - Concentration (Lulu) / Matk+20%, Mdef+50%
 *
 * 601 - (Matk) Magic Break + Focus Magic
 * 602 - (Mnd) Goddesses' Mark (?)
 * 603 - (Atk) Power Break + Boost
 * 604 - (Def) Armor Break
 * 605 - (Atk+Acc) Martial Arts (Refia)
 * 606 - ?
 * 607 - (Mdef) Mental Break
 * 608 - (Def+Mdef) Sentinel Grimoire; Status Reels
 * 609 - (Atk+Def+Matk+Mdef) Full Break + High Potential (Gordon)
 * 610 - (Atk+Matk) Legendary Harmony
 * 611 - (Atk+Def) Emperor's Vessel (Leonheart),
 *
 * 999 + Raise
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
