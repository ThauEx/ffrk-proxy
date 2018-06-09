# ffrk-proxy​

### Installation
**On Windows**:
Go to the release page and download one of the windows releases (x86 or x64).
To start the proxy, just run `start.bat` and when your firewall is asking, please allow the access. Nodejs has to open a port, where the server is running.

**On Linux and Mac**:
Install Nodejs first via package manager, then run `npm install`.
To run it, just type `npm start`.

### Device configuration
I think you all know how to configure a proxy server on your phone/tablet.
For Android:
> Proxy: Manual   
> Server Ip: IP of the computer where this proxy is running on   
> Server Port: 5050   
> Exclude for: 127.0.0.1

To install the root certificate, open the url which is visible in the log of the proxy on your phones webbrowser and accept the certificate installation.   
It should look like this:   
`Open http://XXX.XXX.XXX.XXX:5051 on your phones browser to install the root certificate.`   
Your system could request you to set a security pattern (pin, password, etc), you have to do this.
You have to install the certificate, it won't work without it.

### Important information for ProxyDroid user
In order to use ProxyDroid, you have to disable the whitelist feature, to do that, rename or copy the file `default.no-whitelist.example.yml` to `default.yml` inside the config folder.

### Working methods
ffrk-proxy has two working method, the first is the `intercept` (default) method and the second one `inject`.
To change the working method, check the two sample configs in the config folder.

**Interception method:**
- Intercepts the battle data request and modifies the data and then sends it to the client. This has the benefit to be able to see the whole data related to the battle, like enemies per round, drops etc.

**Injection method:**
- Injects into a html file custom javascript, which lets the client modify the data for you. This should still work, even when the battle data gets transfered encrypted. The downside is not being able to see the battle data anymore and some filters are not working (yet)

### Proxy configuration
By default the proxy is looking for the file `default.yml` inside the `config` folder. There are some example files, which can be renamed to `default.yml`, to use them.
All available values can be found  below or in `lib/config.js`.
For some of the basic settings, it is possible to pass them as command line arguments, e.g. `node bin/app.js --port 6050`.
To load a different config file, use `node bin/app.js --config myconfig`, where `myconfig` is the file `config/myconfig.yml`.

Available config keys:
```
application: 
 properties: 
  config: 
   doc: "name of the config to load"
   default: default
   env: CONFIG
   arg: config
  debug: 
   doc: "enable debug"
   format: boolean
   default: false
   env: DEBUG
   arg: debug
  proxy: 
   properties: 
    ip: 
     doc: "IP address to bind"
     format: ipaddress
     default: "0.0.0.0"
     env: IP
     arg: ip
    port: 
     doc: "port to bind"
     format: port
     default: 5050
     env: PORT
     arg: port
    whitelist: 
     doc: "use whitelist"
     format: boolean
     default: true
     env: WHITELIST
     arg: whitelist
    method:
     doc: "proxy working method"
     format: ["intercept", "inject"],
     default: "intercept"
  cert: 
   properties: 
    ip: 
     doc: "IP address to bind"
     format: ipaddress
     default: "0.0.0.0"
    port: 
     doc: "port to bind"
     format: port
     default: 5051
     env: CERT_PORT
     arg: "cert-port"
  dump: 
   properties: 
    get_battle_init_data: 
     doc: "dump the content of get_battle_init_data"
     format: boolean
     default: true
buddy: 
 properties: 
  stats: 
   properties: 
    atk: 
     doc: "atk of buddy"
     format: number
     default: 9999
    def: 
     doc: "def of buddy"
     format: number
     default: 9999
    matk: 
     doc: "matk of buddy"
     format: number
     default: 9999
    mdef: 
     doc: "mdef of buddy"
     format: number
     default: 9999
    mnd: 
     doc: "mnd of buddy"
     format: number
     default: 9999
    acc: 
     doc: "acc of buddy"
     format: number
     default: 9999
    eva: 
     doc: "eva of buddy"
     format: number
     default: 9999
    spd: 
     doc: "spd of buddy"
     format: number
     default: 9999
  attack: 
   properties: 
    type: 
     doc: "attack type"
     format: 
      - DIRECT
      - INDIRECT
     default: INDIRECT
    attributes: 
     doc: "attack attributes"
     format: array
     default: 
      - POISON
      - SILENCE
      - PARALYSIS
      - CONFUSION
      - SLOW
      - STOP
      - BLINDED
      - SLEEP
      - DOOM
      - BERSERKER
      - SAP
      - STUN
    counterAbility: 
     doc: "Sets all attacks to prevent counter-attacks from bosses"
     format: boolean
     default: true
    hitAll: 
     doc: "enables Hit-All/Zealot"
     format: boolean
     default: true
    elementType: 
     doc: "decides the type of element the attack will be"
     format: 
      - FIRE
      - ICE
      - THUNDER
      - EARTH
      - WIND
      - WATER
      - HOLY
      - DARK
      - BIO
      - NONELE
     default: NONELE
    multiHit: 
     doc: "decides how often Attack will hit"
     format: number
     default: 1
    quickAttack: 
     doc: "reduces cast time"
     format: boolean
     default: true
    abilitySpammer: 
     doc: "infinite amount of uses for abilities"
     format: boolean
     default: true
    soulStrikeSpammer: 
     doc: "allows all soul strikes to be instant-cast"
     format: boolean
     default: true
  status: 
   doc: "status ailments"
   format: array
   default: 
    - HASTE
    - PROTECT
    - SHELL
    - REGEN_STRONG
    - COUNTER_AIMING
    - RUNIC
    - MIGHTY_GUARD_1
enemy: 
 properties: 
  stats: 
   properties: 
    hp: 
     doc: "hp of enemy"
     format: number
     default: 0
    atk: 
     doc: "atk of enemy"
     format: number
     default: 1
    def: 
     doc: "def of enemy"
     format: number
     default: 1
    matk: 
     doc: "matk of enemy"
     format: number
     default: 1
    mdef: 
     doc: "mdef of enemy"
     format: number
     default: 1
    mnd: 
     doc: "mnd of enemy"
     format: number
     default: 1
    acc: 
     doc: "acc of enemy"
     format: number
     default: 1
    eva: 
     doc: "eva of enemy"
     format: number
     default: 1
    spd: 
     doc: "spd of enemy"
     format: number
     default: 1
  defAttributes: 
   properties: 
    enabled: 
     doc: "change enemy def attributes"
     format: boolean
     default: true
    attributes: 
     doc: "defense attributes"
     format: array
     default: 
supporter: 
 properties: 
  stats: 
   properties: 
    atk: 
     doc: "atk of buddy"
     format: number
     default: 9999
    matk: 
     doc: "matk of buddy"
     format: number
     default: 9999
    mnd: 
     doc: "mnd of buddy"
     format: number
     default: 9999
    acc: 
     doc: "acc of buddy"
     format: number
     default: 9999
  attack: 
   properties: 
    soulStrikeSpammer: 
     doc: "allows all soul strikes to be instant-cast"
     format: boolean
     default: true
magicite: 
 properties: 
  summon: 
   properties: 
    skillSpammer: 
     doc: "allows all magicite skills to be instant-cast"
     format: boolean
     default: true
    duration: 
     doc: "duration of magicite skill"
     format: number
     default: 2000
    gaugeFillTime: 
     doc: "time to fill magicite gauge"
     format: number
     default: 1000
rounds: 
 properties: 
  shortRounds: 
   properties: 
    enabled: 
     doc: "reduce number of rounds to one (last), but keep all drops"
     format: boolean
     default: true
```

### Requirements:
* Nodejs >= 8.0

### Thanks to:
* SirPhoenix88   
* Everyone on the [contributors](https://github.com/ThauEx/ffrk-proxy/graphs/contributors) page.
