const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const convict = require('convict');

const config = convict({
  application: {
    config: {
      doc: 'name of the config to load',
      format: function check(val) {
        if (!/^.+$/.test(val)) {
          throw new Error('must be a string or number');
        }
      },
      default: 'default',
      env: 'CONFIG',
      arg: 'config',
    },
    debug: {
      doc: 'enable debug',
      format: Boolean,
      default: false,
      env: 'DEBUG',
      arg: 'debug',
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
      method: {
        doc: 'proxy working method',
        format: ['intercept', 'inject'],
        default: 'intercept',
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
        env: 'CERT_PORT',
        arg: 'cert-port',
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
          'STUN',
        ],
      },
      counterAbility: {
        doc: 'Sets all attacks to prevent counter-attacks from bosses',
        format: Boolean,
        default: true,
      },
      hitAll: {
        doc: 'enables Hit-All/Zealot',
        format: Boolean,
        default: true,
      },
      elementType: {
        doc: 'decides the type of element the attack will be',
        format: ['FIRE', 'ICE', 'THUNDER', 'EARTH', 'WIND', 'WATER', 'HOLY', 'DARK', 'BIO', 'NONELE'],
        default: 'NONELE',
      },
      multiHit: {
        doc: 'decides how often Attack will hit',
        format: Number,
        default: 1,
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
      hp: {
        doc: 'hp of enemy',
        format: Number,
          default: 0,
      },
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
  magicite: {
    summon: {
      skillSpammer: {
        doc: 'allows all magicite skills to be instant-cast',
        format: Boolean,
        default: true,
      },
      duration: {
        doc: 'duration of magicite skill',
        format: Number,
        default: 2000,
      },
      gaugeFillTime: {
        doc: 'time to fill magicite gauge',
        format: Number,
        default: 1000,
      },
    },
  },
  rounds: {
    shortRounds: {
      enabled: {
        doc: 'reduce number of rounds to one (last), but keep all drops',
        format: Boolean,
        default: true,
      },
    },
  },
});

const configFilename = __dirname + '/../config/' + config.get('application.config') + '.yml';
if (fs.existsSync(configFilename)) {
  console.log('Using custom config', path.resolve(configFilename));
  try {
    config.loadFile(configFilename, {parse: yaml.safeLoad});
  } catch (e) {
    console.error(e);
  }
}

try {
  config.validate();
} catch (error) {
  console.error('Failed to validate config file', path.normalize(configFilename));
  console.error(error);
  process.exit();
}

module.exports = config;
