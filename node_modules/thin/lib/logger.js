
// TODO: switch to some mature logger instead
function Logger(debug) {
  this.debug = debug;
}

Logger.prototype.info = function() {
  if (!this.debug)
    return;
  console.log.apply(console, arguments);
};

Logger.prototype.error = function() {
  console.error.apply(console, arguments);
};



module.exports = Logger;
