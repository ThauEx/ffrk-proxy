var request = require('request');

module.exports = function(opts, cb) {
  opts.json = true;
  // opts.strictSSL = false;
  opts.rejectUnhauthorized = false;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  request(opts, function(err, res, body) {
    cb(err, body, res);
  });
};
