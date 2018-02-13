// setInterval(function() {
//   FF.ns.battle.BattleViewController.getInstance().showMessage({
//     message: 'ffrk proxy init',
//   });
// }, 5000);


module.exports = {
  magiciteFilter: require('./filter/magicite'),
  buddyFilter: require('./filter/buddy'),
  enemyFilter: require('./filter/enemy'),
  roundsFilter: require('./filter/rounds'),
  supporterFilter: require('./filter/supporter'),
};

setInterval(function() {
    try {
      if (FF.ns.battle.BattleInitData.injected)
        FF.ns.battle.BattleInitData.injected = true;

        if (!FF.ns.battle.BattleInitData.injected) {
          var oldGet = FF.ns.battle.BattleInitData.prototype.get;
          FF.ns.battle.BattleInitData.prototype.get = function(e, t) {
              var data = oldGet.call(this, e, t);

              if (data.battle) {
                data.battle.main_beast = inject.magiciteFilter.update(data.battle.main_beast);
                data.battle.buddy = inject.buddyFilter.update(data.battle.buddy);
                data.battle.rounds = inject.enemyFilter.update(data.battle.rounds);
                data.battle.supporter = inject.supporterFilter.update(data.battle.supporter);
              }

              return data;
          };
        }
    } catch (e) {
      FF.ns.battle.BattleViewController.getInstance().showMessage({message: e.toString()});
    }
}, 1000);
