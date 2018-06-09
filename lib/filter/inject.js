var config = require('../config');

setInterval(function() {
  try {
    if (!FF.injected) {
      if (FF && FF.ns && FF.ns.battle && FF.ns.battle.BattleInitData && FF.ns.battle.BattleInitData.prototype) {
        var originalGet = FF.ns.battle.BattleInitData.prototype.get;

        FF.ns.battle.BattleInitData.prototype.get = function(e, t) {
          FF.injected = true;
          var data = originalGet.call(this, e, t);

          if (data.battle) {
            data.battle.main_beast = inject.magiciteFilter(data.battle.main_beast);
            data.battle.buddy = inject.buddyFilter(data.battle.buddy);
            data.battle.rounds = inject.enemyFilter(data.battle.rounds);
            data.battle.supporter = inject.supporterFilter(data.battle.supporter);

            if (config.get('rounds.shortRounds.enabled')) {
              // data.battle.rounds = inject.roundsFilter(json.battle.rounds);
            }
          }

          return data;
        };
      }
    }
  } catch (e) {
    window.alert(e.toString());
  }
}, 1000);
