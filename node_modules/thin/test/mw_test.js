var assert = require('assert');

var Thin = require('../lib/thin'),
  Remote = require('./helpers/remote'),
  request = require('./helpers/request');


describe('middleware', function() {

  var remote = new Remote;
  var proxy = new Thin;


  before(function(done) {
    remote.listen(30000, 30001, function(err) {
      if (err) return done(err);
      proxy.listen(30002, 'localhost', done);
    });
  });

  after(proxy.close.bind(proxy));
  after(remote.close.bind(remote));

  beforeEach(function() {
    proxy.removeInterceptors();
  });


  it('should support middleware at least', function(done) {
    proxy.use(function(req, res, next) {
      res.end('hello there');
    });

    request({
      proxy: 'http://localhost:30002',
      url: 'http://localhost:30000/test'
    }, function(err, res) {
      if (err) return done(err);
      assert.equal(res, 'hello there');
      done()
    });

  });

});
