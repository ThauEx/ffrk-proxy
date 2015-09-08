var Table = require('cli-table');

exports.update = function (json) {
    for (var round in json) {
        console.log(new Table({head: ['Round: ' + (parseInt(round)+1)]}).toString());

        for (var enemy in json[round].enemy) {
            var tHeader = [];
            var oldVal = [];
            var newVal = [];
            var tmp = 0;
            console.log("==============");

            console.log(
                'Name: ' + json[round].enemy[enemy].children[0].params[0].disp_name +
                ' (uid: ' + json[round].enemy[enemy].children[0].uid + ')' +
                ' (lvl: ' + json[round].enemy[enemy].children[0].lv + ')'
            );

            tmp = json[round].enemy[enemy].children[0].init_hp;
            json[round].enemy[enemy].children[0].init_hp = 1;
            tHeader.push('init_hp');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].init_hp);

            tmp = json[round].enemy[enemy].children[0].max_hp;
            json[round].enemy[enemy].children[0].max_hp = 1;
            json[round].enemy[enemy].children[0].params[0].max_hp = 1;
            tHeader.push('max_hp');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].max_hp);

            tmp = json[round].enemy[enemy].children[0].params[0].atk;
            json[round].enemy[enemy].children[0].params[0].atk = 1;
            tHeader.push('atk');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].atk);

            tmp = json[round].enemy[enemy].children[0].params[0].mdef;
            json[round].enemy[enemy].children[0].params[0].mdef = 1;
            tHeader.push('mdef');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].mdef);

            tmp = json[round].enemy[enemy].children[0].params[0].acc;
            json[round].enemy[enemy].children[0].params[0].acc = 1;
            tHeader.push('acc');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].acc);

            tmp = json[round].enemy[enemy].children[0].params[0].def;
            json[round].enemy[enemy].children[0].params[0].def = 1;
            tHeader.push('def');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].def);

            tmp = json[round].enemy[enemy].children[0].params[0].eva;
            json[round].enemy[enemy].children[0].params[0].eva = 1;
            tHeader.push('eva');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].eva);

            tmp = json[round].enemy[enemy].children[0].params[0].matk;
            json[round].enemy[enemy].children[0].params[0].matk = 1;
            tHeader.push('matk');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].matk);

            tmp = json[round].enemy[enemy].children[0].params[0].spd;
            json[round].enemy[enemy].children[0].params[0].spd = 1;
            tHeader.push('spd');
            oldVal.push(tmp);
            newVal.push(json[round].enemy[enemy].children[0].params[0].spd);

            var table = new Table({
                head: tHeader
            });
            table.push(oldVal);
            table.push(newVal);

            console.log(table.toString());
        }
    }

    return json;
};
