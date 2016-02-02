/**
 * Original code by SirPhoenix88/ThauEx on 2/2/2016
 *
 */

exports.update = function(json) {
  for (var supporter in json) {
  
    //assign max stats to roaming warrior, only atk, mag, and mind should be needed
    json[supporter].params[0].atk = 9999;
    json[supporter].params[0].acc = 9999;
    json[supporter].params[0].matk = 9999;
    json[supporter].params[0].mnd = 9999;
    
    //roaming warrior soulbreak spam
    json[supporter].max_supporter_ss_gauge = '20';
    json[supporter].supporter_ss_gauge = '20';
    json[supporter].soul_strikes[0].options.cast_time = '100';

  }

  return json;
};
