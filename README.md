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

To install the root certificate, open `ComputerIP:5051` in your phones webbrowser and accept the certificate installation. Your system could request you to set a security pattern (pin, password, etc), you have to do this.
You have to install the certificate, it won't work without it.

### Important information for ProxyDroid user
In order to use ProxyDroid, you have to disable the whitelist feature, to do that, rename or copy the file `default.no-whitelist.example.yml` to `default.yml` inside the config folder.

### Proxy configuration
By default the proxy is looking for the file `default.yml` inside the `config` folder. There are some example files, which can be renamed to `default.yml`, to use them.
All available values can be found in `lib/config.js`.
For some of the basic settings, it is possible to pass them as command line arguments, e.g. `node bin/app.js --port 6050`.
To load a different config file, use `node bin/app.js --config myconfig`, where `myconfig` is the file `config/myconfig.yml`.

Available config keys:
```
application:
  cert:
    ip: {}
    port: {}
  config:
    format: string
  dump:
    get_battle_init_data:
      format: boolean
  proxy:
    domains:
      format: object
    ip: {}
    port: {}
    whitelist:
      format: boolean
buddy:
  attack:
    abilitySpammer:
      format: boolean
    attributes:
      format: array
    counterAbility:
      format: boolean
    elementType: {}
    hitAll:
      format: boolean
    multiHit:
      format: number
    quickAttack:
      format: boolean
    soulStrikeSpammer:
      format: boolean
    type: {}
  stats:
    acc:
      format: number
    atk:
      format: number
    def:
      format: number
    eva:
      format: number
    matk:
      format: number
    mdef:
      format: number
    mnd:
      format: number
    spd:
      format: number
  status:
    format: array
enemy:
  defAttributes:
    attributes:
      format: array
    enabled:
      format: boolean
  stats:
    acc:
      format: number
    atk:
      format: number
    def:
      format: number
    eva:
      format: number
    matk:
      format: number
    mdef:
      format: number
    mnd:
      format: number
    spd:
      format: number
supporter:
  attack:
    soulStrikeSpammer:
      format: boolean
  stats:
    acc:
      format: number
    atk:
      format: number
    matk:
      format: number
    mnd:
      format: number
```

### Requirements:
* Nodejs >= 0.12

### Thanks to:
* KHShadowrunner
* SirPhoenix88
