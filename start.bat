@echo off
bin\node.exe .\node_modules\babel-cli\bin\babel.js --plugins inline-json,..\babel\config-plugin.js lib\filter\*.js --out-dir public\
del public\*.js
move public\lib\filter\* public
rd /s /q public\lib
bin\node.exe bin/app.js
pause
