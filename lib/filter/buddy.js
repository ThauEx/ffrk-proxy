exports.update = function (json) {
    for (var buddy in json) {
        var oldVal = 0;
        console.log("==============");
        console.log("no: " + json[buddy].no);
        console.log("id: " + json[buddy].id);
        console.log("Name: " + json[buddy].params[0].disp_name);
        console.log("init_hp: " + json[buddy].init_hp);

        oldVal = json[buddy].params[0].atk;
        json[buddy].params[0].atk = 9999;
        console.log("atk: " + oldVal + " -> " + json[buddy].params[0].atk);

        oldVal = json[buddy].params[0].mdef;
        json[buddy].params[0].mdef = 9999;
        console.log("mdef: " + oldVal + " -> " + json[buddy].params[0].mdef);

        oldVal = json[buddy].params[0].acc;
        json[buddy].params[0].acc = 9999;
        console.log("acc: " + oldVal + " -> " + json[buddy].params[0].acc);

        oldVal = json[buddy].params[0].def;
        json[buddy].params[0].def = 9999;
        console.log("def: " + oldVal + " -> " + json[buddy].params[0].def);

        oldVal = json[buddy].params[0].eva;
        json[buddy].params[0].eva = 9999;
        console.log("eva: " + oldVal + " -> " + json[buddy].params[0].eva);

        oldVal = json[buddy].params[0].matk;
        json[buddy].params[0].matk = 9999;
        console.log("matk: " + oldVal + " -> " + json[buddy].params[0].matk);

        oldVal = json[buddy].params[0].spd;
        json[buddy].params[0].spd = 9999;
        console.log("spd: " + oldVal + " -> " + json[buddy].params[0].spd);
    }

    return json;
};
