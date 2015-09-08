var Table = require('cli-table');

exports.update = function (json) {
    for (var buddy in json) {
        var table = new Table({
            head: ['Stat', 'Original', 'Modified']
        });
        var oldVal = 0;
        console.log("==============");
        console.log("no: " + json[buddy].no);
        console.log("id: " + json[buddy].id);
        console.log("Name: " + json[buddy].params[0].disp_name);
        console.log("init_hp: " + json[buddy].init_hp);

        oldVal = json[buddy].params[0].atk;
        json[buddy].params[0].atk = 9999;
        table.push(['atk', oldVal, json[buddy].params[0].atk]);

        oldVal = json[buddy].params[0].mdef;
        json[buddy].params[0].mdef = 9999;
        table.push(['mdef', oldVal, json[buddy].params[0].mdef]);

        oldVal = json[buddy].params[0].acc;
        json[buddy].params[0].acc = 9999;
        table.push(['acc:', oldVal, json[buddy].params[0].acc]);

        oldVal = json[buddy].params[0].def;
        json[buddy].params[0].def = 9999;
        table.push(['def:', oldVal, json[buddy].params[0].def]);

        oldVal = json[buddy].params[0].eva;
        json[buddy].params[0].eva = 9999;
        table.push(['eva:', oldVal, json[buddy].params[0].eva]);

        oldVal = json[buddy].params[0].matk;
        json[buddy].params[0].matk = 9999;
        table.push(['matk', oldVal, json[buddy].params[0].matk]);

        oldVal = json[buddy].params[0].spd;
        json[buddy].params[0].spd = 9999;
        table.push(['spd:', oldVal, json[buddy].params[0].spd]);

        console.log(table.toString());
    }

    return json;
};
