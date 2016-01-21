var fs = require('fs');
var convict = require('convict');

var config = convict({
  application: {
    config: {
      doc: 'name of the config to load',
      format: String,
      default: 'default',
      env: 'CONFIG',
      arg: 'config',
    },
    proxy: {
      ip: {
        doc: 'IP address to bind',
        format: 'ipaddress',
        default: '0.0.0.0',
        env: 'IP',
        arg: 'ip',
      },
      port: {
        doc: 'port to bind',
        format: 'port',
        default: 5050,
        env: 'PORT',
        arg: 'port',
      },
    },
    cert: {
      ip: {
        doc: 'IP address to bind',
        format: 'ipaddress',
        default: '0.0.0.0',
      },
      port: {
        doc: 'port to bind',
        format: 'port',
        default: 5051,
      },
    },
  },
  buddy: {
    stats: {
      atk: {
        doc: 'atk of buddy',
        format: 'int',
        default: 9999,
      },
      def: {
        doc: 'def of buddy',
        format: 'int',
        default: 9999,
      },
      matk: {
        doc: 'matk of buddy',
        format: 'int',
        default: 9999,
      },
      mdef: {
        doc: 'mdef of buddy',
        format: 'int',
        default: 9999,
      },
      mnd: {
        doc: 'mnd of buddy',
        format: 'int',
        default: 9999,
      },
      acc: {
        doc: 'acc of buddy',
        format: 'int',
        default: 9999,
      },
      eva: {
        doc: 'eva of buddy',
        format: 'int',
        default: 9999,
      },
      spd: {
        doc: 'spd of buddy',
        format: 'int',
        default: 9999,
      },
    },
    attack: {
      type: {
        doc: 'attack type',
        format: ['DIRECT', 'RANGED'],
        default: 'RANGED',
      },
      attributes: {
        doc: 'attack attributes',
        format: Array,
        default: [
          'POISON',
          'SILENCE',
          'PARALYSIS',
          'CONFUSION',
          'SLOW',
          'STOP',
          'BLINDED',
          'SLEEP',
          'DOOM',
          'BERSERKER',
          'SAP',
          'STAN',
        ],
      },
      status: {
        doc: 'status ailments',
        format: Array,
        default: [
          'HASTE',
          'PROTECT',
          'SHELL',
          'REGEN_STRONG',
          'COUNTER_AIMING',
          'RUNIC',
          'MIGHTY_GUARD_1',
        ],
      },
    },
  },
  enemy: {
    stats: {
      atk: {
        doc: 'atk of enemy',
        format: 'int',
        default: 1,
      },
      def: {
        doc: 'def of enemy',
        format: 'int',
        default: 1,
      },
      matk: {
        doc: 'matk of enemy',
        format: 'int',
        default: 1,
      },
      mdef: {
        doc: 'mdef of enemy',
        format: 'int',
        default: 1,
      },
      mnd: {
        doc: 'mnd of enemy',
        format: 'int',
        default: 1,
      },
      acc: {
        doc: 'acc of enemy',
        format: 'int',
        default: 1,
      },
      eva: {
        doc: 'eva of enemy',
        format: 'int',
        default: 1,
      },
      spd: {
        doc: 'spd of enemy',
        format: 'int',
        default: 1,
      },
    },
    defAttributes: {
      doc: 'defense attributes',
      format: Array,
      default: [],
    },
  },
});

var configFilename = __dirname + '/../config/default.json';
if (!fs.existsSync(configFilename)) {
  fs.renameSync(__dirname + '/../config/default.dist.json', configFilename);
}

config.loadFile(__dirname + '/../config/' + config.get('application.config') + '.json');
config.validate();

module.exports = config;
