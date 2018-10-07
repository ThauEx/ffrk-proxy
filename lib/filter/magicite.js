const Table = require('cli-table');
const config = require('../config');

exports.update = function(json) {
  const table = new Table({
    head: [
      'Name',
      'id',
      'HP',
      'atk',
      'def',
      'matk',
      'mdef',
      'mnd',
      'acc',
      'eva',
      'spd',
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

  for (let beast in json) {
    const tmpRow = [];
    let tmp = 0;

    const params = json[beast].params[0];

    tmpRow.push(params.disp_name);
    tmpRow.push(params.id);

    tmp = json[beast].init_hp;
    json[beast].init_hp = parseInt(json[beast].max_hp);
    tmpRow.push(tmp + '/' + json[beast].max_hp);

    tmpRow.push(params.atk);
    tmpRow.push(params.def);
    tmpRow.push(params.matk);
    tmpRow.push(params.mdef);
    tmpRow.push(params.mnd);
    tmpRow.push(params.acc);
    tmpRow.push(params.eva);
    tmpRow.push(params.spd);

    /**
     * Skill spammer
     * Allows all super skills to be instant-cast
     * Set cost to 100 ms. (Normal cost is 2.5 secs)
     * Number of uses set to 20
     */
     if (config.get('magicite.summon.skillSpammer')) {
       const active_skill = json[beast].active_skills[0];
       active_skill.options.cast_time = '100';
       active_skill.num = '20';
       active_skill.max_num = '20';
    }

    /**
     * Summon charge time
     * From start of battle or from previous cast
     * Normal charge time is 10 seconds
     */
    if (config.get('magicite.summon.gaugeFillTime')) {
      params.required_time_to_fill_synchronization_gauge = config.get('magicite.summon.gaugeFillTime') || params.required_time_to_fill_synchronization_gauge;
    }

    /**
     * Summon duration
     * Normal duration is 20 seconds
     */
    if (config.get('magicite.summon.duration')) {
      params.synchronization_duration = config.get('magicite.summon.duration') || params.synchronization_duration;
    }

    table.push(tmpRow);
    console.log(table.toString() + '\n');
  }

  return json;
};
