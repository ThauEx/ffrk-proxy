var fs = require('fs');
var path = require('path');
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
      whitelist: {
        doc: 'use whitelist',
        format: Boolean,
        default: true,
        env: 'WHITELIST',
        arg: 'whitelist',
      },
      domains: {
        doc: 'domains on which modifications should be applied',
        // TODO: Improve syntax
        format: Object,
        default: {
          'ffrk.denagames.com': {
            cert: __dirname + '/../cert/wwe.crt',
            key: __dirname + '/../cert/wwe.key',
          },
          'dff.sp.mbga.jp': {
            cert: __dirname + '/../cert/jp.crt',
            key: __dirname + '/../cert/jp.key',
          },
        },
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
    dump: {
      get_battle_init_data: {
        doc: 'dump the content of get_battle_init_data',
        format: Boolean,
        default: true,
      }
    }
  },
  buddy: {
    stats: {
      atk: {
        doc: 'atk of buddy',
        format: Number,
        default: 9999,
      },
      def: {
        doc: 'def of buddy',
        format: Number,
        default: 9999,
      },
      matk: {
        doc: 'matk of buddy',
        format: Number,
        default: 9999,
      },
      mdef: {
        doc: 'mdef of buddy',
        format: Number,
        default: 9999,
      },
      mnd: {
        doc: 'mnd of buddy',
        format: Number,
        default: 9999,
      },
      acc: {
        doc: 'acc of buddy',
        format: Number,
        default: 9999,
      },
      eva: {
        doc: 'eva of buddy',
        format: Number,
        default: 9999,
      },
      spd: {
        doc: 'spd of buddy',
        format: Number,
        default: 9999,
      },
    },
    attack: {
      type: {
        doc: 'attack type',
        format: ['DIRECT', 'INDIRECT'],
        default: 'INDIRECT',
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
      quickAttack: {
        doc: 'reduces cast time',
        format: Boolean,
        default: true,
      },
      abilitySpammer: {
        doc: 'infinite amount of uses for abilities',
        format: Boolean,
        default: true,
      },
      soulStrikeSpammer: {
        doc: 'allows all soul strikes to be instant-cast',
        format: Boolean,
        default: true,
      },
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
  enemy: {
    stats: {
      atk: {
        doc: 'atk of enemy',
        format: Number,
        default: 1,
      },
      def: {
        doc: 'def of enemy',
        format: Number,
        default: 1,
      },
      matk: {
        doc: 'matk of enemy',
        format: Number,
        default: 1,
      },
      mdef: {
        doc: 'mdef of enemy',
        format: Number,
        default: 1,
      },
      mnd: {
        doc: 'mnd of enemy',
        format: Number,
        default: 1,
      },
      acc: {
        doc: 'acc of enemy',
        format: Number,
        default: 1,
      },
      eva: {
        doc: 'eva of enemy',
        format: Number,
        default: 1,
      },
      spd: {
        doc: 'spd of enemy',
        format: Number,
        default: 1,
      },
    },
    defAttributes: {
      enabled: {
        doc: 'change enemy def attributes',
        format: Boolean,
        default: true,
      },
      attributes: {
        doc: 'defense attributes',
        format: Array,
        default: [],
      },
    },
  },
  supporter: {
    stats: {
      atk: {
        doc: 'atk of buddy',
        format: Number,
        default: 9999,
      },
      matk: {
        doc: 'matk of buddy',
        format: Number,
        default: 9999,
      },
      mnd: {
        doc: 'mnd of buddy',
        format: Number,
        default: 9999,
      },
      acc: {
        doc: 'acc of buddy',
        format: Number,
        default: 9999,
      },
    },
    attack: {
      soulStrikeSpammer: {
        doc: 'allows all soul strikes to be instant-cast',
        format: Boolean,
        default: true,
      },
    },
  },
});

var configFilename = __dirname + '/../config/' + config.get('application.config') + '.json';
if (fs.existsSync(configFilename)) {
  config.loadFile(__dirname + '/../config/' + config.get('application.config') + '.json');
}

try {
  config.validate();
} catch (error) {
  console.error('Failed to validate config file', path.normalize(configFilename));
  console.error(error);
  process.exit();
}

module.exports = config;
