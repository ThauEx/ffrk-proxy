# ffrk-proxy​

### Installation
**On Windows**:
If you don't have Nodejs installed, run `install.bat`, it will download a working version for you.
To start the proxy, just run `start.bat` and when your firewall is asking, please allow the access. Nodejs has to open a port, where the server is running.

**On Linux and Mac**:
Install Nodejs first via package manager.
Just type npm start to run it, all modules are already included, so please do not update them!

### Device configuration
I think you all know how to configure a proxy server on your phone/tablet.
For Android:
> Proxy: Manual

> Server Ip: IP of the computer where this proxy is running on

> Server Port: 5050

> Exclude for: 127.0.0.1

To install the root certificate, open `ComputerIP:5051` in your phones webbrowser and accept the certificate installation. Your system could request you to set a security pattern (pin, password, etc), you have to do this.
You have to install the certificate, it won't work without it.

### Proxy configuration
By default the proxy is looking for the file `default.yml` inside the `config` folder. There are some example files, which can be renamed to `default.yml`, to use them.
All available values can be found in `lib/config.js`.
For some of the basic settings, it is possible to pass them as command line arguments, e.g. `node bin/app.js --port 6050`.
To load a different config file, use `node bin/app.js --config myconfig`, where `myconfig` is the file `config/myconfig.yml`.

Available config keys:
```
  application:
    properties:
      config:
        format: string
      proxy:
        properties:
          ip: {}
          port: {}
          whitelist:
            format: boolean
          domains:
            format: object
      cert:
        properties:
          ip: {}
          port: {}
      dump:
        properties:
          get_battle_init_data:
            format: boolean
  buddy:
    properties:
      stats:
        properties:
          atk:
            format: number
          def:
            format: number
          matk:
            format: number
          mdef:
            format: number
          mnd:
            format: number
          acc:
            format: number
          eva:
            format: number
          spd:
            format: number
      attack:
        properties:
          type: {}
          attributes:
            format: array
          counterAbility:
            format: boolean
          hitAll:
            format: boolean
          elementType: {}
          multiHit:
            format: number
          quickAttack:
            format: boolean
          abilitySpammer:
            format: boolean
          soulStrikeSpammer:
            format: boolean
      status:
        format: array
  enemy:
    properties:
      stats:
        properties:
          atk:
            format: number
          def:
            format: number
          matk:
            format: number
          mdef:
            format: number
          mnd:
            format: number
          acc:
            format: number
          eva:
            format: number
          spd:
            format: number
      defAttributes:
        properties:
          enabled:
            format: boolean
          attributes:
            format: array
  supporter:
    properties:
      stats:
        properties:
          atk:
            format: number
          matk:
            format: number
          mnd:
            format: number
          acc:
            format: number
      attack:
        properties:
          soulStrikeSpammer:
            format: boolean
```

### Requirements:
* Nodejs >= 0.12

### Thanks to:
* KHShadowrunner
* SirPhoenix88
