.\bin\node.exe .\node_modules\babel-cli\bin\babel.js --plugins inline-json,..\babel\config-plugin.js lib\filter\*.js --out-dir public\
rm .\public\*.js
mv .\public\lib\filter\* .\public
rm -r -fo .\public\lib
node bin/app.js
