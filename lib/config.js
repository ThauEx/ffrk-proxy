var fs = require('fs');

var config = __dirname + '/../config/default.json';
if (!fs.existsSync(config)) {
  fs.renameSync(__dirname + '/../config/default.dist.json', config);
}

module.exports = require(config)
