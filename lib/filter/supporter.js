var Table = require('cli-table');
var config = require(__dirname + '/../config.js');

exports.update = function(json) {
  var table = new Table({
    head: [
      'Name',
      'id',
      'HP',
      'atk',
      'matk',
      'mnd',
      'acc',
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

  for (var supporter in json) {
    var tmpRow = [];

    var params = json[supporter].params[0];

    tmpRow.push(params.disp_name);
    tmpRow.push(json[supporter].id);

    json[supporter].init_hp = parseInt(json[supporter].max_hp);
    tmpRow.push(json[supporter].init_hp + '/' + json[supporter].max_hp);

    // assign max stats to roaming warrior, only atk, mag, and mind should be needed
    params.atk = config.get('supporter.stats.atk') || params.atk;
    tmpRow.push(params.atk);

    params.matk = config.get('supporter.stats.matk') || params.matk;
    tmpRow.push(params.matk);

    params.mnd = config.get('supporter.stats.mnd') || params.mnd;
    tmpRow.push(params.mnd);

    params.acc = config.get('supporter.stats.acc') || params.acc;
    tmpRow.push(params.acc);

    // roaming warrior soulbreak spam
    if (config.get('supporter.attack.soulStrikeSpammer')) {
      json[supporter].max_supporter_ss_gauge = '20';
      json[supporter].supporter_ss_gauge = '20';
      json[supporter].soul_strikes[0].options.cast_time = '100';
    }

    table.push(tmpRow);
  }

  console.log('Supporters');
  console.log(table.toString());

  return json;
};
