# ffrk-proxy​

### Installation
**On Windows**:
If you don't have Nodejs installed, run `install.bat`, it will download a working version for you.
To start the proxy, just run `start.bat` and when your firewall is asking, please allow the access. Nodejs has to open a port, where the server is running.

**On Linux and Mac**:
Install Nodejs first via package manager.
Just type npm start to run it, all modules are already included, so please do not update them!

### Configuration
I think you all know how to configure a proxy server on your phone/tablet.
For Android:
> Proxy: Manual

> Server Ip: IP of the computer where this proxy is running on

> Server Port: 5050

> Exclude for: 127.0.0.1

To install the root certificate, open `ComputerIP:5051` in your phones webbrowser and accept the certificate installation. Your system could request you to set a security pattern (pin, password, etc), you have to do this.
You have to install the certificate, it won't work without it.

#### Known bugs:
At least on Linux, you have to restart the game, when you try to enter a dungeon with not enough stamina. I will have a closer look on it, when I have some time...
When reporting bugs, please tell me your server operating system+version and your android device+version.

### Requirements:
* Nodejs >= 0.12

### Thanks to:
* KHShadowrunner
* SirPhoenix88
