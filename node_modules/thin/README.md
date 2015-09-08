node-thin
=========

is a HTTP/HTTPS debugging proxy which allows to use collection of middlewares/interceptors in order to trace/pre-process/post-process requests and resposes. The proxy in HTTPS mode actually allows simulate the *man-in-the-middle* (mitm) attack or traffic hijacking. Concept of middlewares is similar to connect (expressjs) frameworks.


### Installation

```
npm i thin
```


### Usage

#### Proxy:

```javascript
var Thin = require('thin');

var proxy = new Thin;

// `req` and `res` params are `http.ClientRequest` and `http.ServerResponse` accordingly
// be sure to check http://nodejs.org/api/http.html for more details
proxy.use(function(req, res, next) {
  console.log('Proxying:', req.url);
  next();
});

// you can add different layers of "middleware" similar to "connect",
// but with few exclusions
proxy.use(function(req, res, next) {
  if (req.url === '/foobar')
    return res.end('intercepted');
  next();
});

proxy.listen(8081, 'localhost', function(err) {
  // .. error handling code ..
});

```

#### Test server:

```javascript
var express = require('express');
var app = express();

app.use(express.urlencoded({limit: '10mb'}));

app.get('/test', function(req, res){
  console.log(req.protocol, 'get req.query', req.query);
  res.end('get: hello world');
});

app.post('/test', function(req, res) {
  console.log(req.protocol, 'post req.query', req.query);
  console.log(req.protocol, 'post req.body', req.body);
  res.end('post: hello world');
});

app.all('/foobar', function(req, res) {
  // this route won't be reached because of mitm interceptor
  res.send('original');
});

app.listen(3000, function(err) {
  if (err) console.log('http server', err)
});


var fs = require('fs');
var https = require('https');

https.createServer({
  key: fs.readFileSync('./cert/dummy.key'), // your server keys
  cert: fs.readFileSync('./cert/dummy.crt')
}, app).listen(3001, function(err) {
  if (err) console.log('https server', err)
});
```

If you try to make a query to your server you should be able to see a log from `thin`:

  curl -d "foo=baz" -k -x https://localhost:8081 https://localhost:3001/test?foo=bar
  curl -d "foo=baz" -x http://localhost:8081 http://localhost:3000/test?foo=bar

You can intercept particular route:

  curl -d "foo=baz" -k -x https://localhost:8081 https://localhost:3001/foobar

Response should be `intercepted` instead of `original`.
