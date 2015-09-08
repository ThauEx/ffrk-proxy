/*
  Modify image responses, turning them upside down ala "upside-down-ternet".

  Demonstrates modifying binary image responses. Only handles image/jpeg, image/png
  and image/bmp, due to limitations of the Jimp library. Will probably explode if a lot
  of very large images are requested at once.
*/
var Thin = require('../');
var helpers = require('./helpers');
var Jimp = require('jimp');

var proxy = new Thin({
    followRedirect: false,
    strictSSL: false,
    SNICallback: helpers.makeSNICallback()
});

/*
  Rotate an image passed in imgBuf and pass a Buffer with the result  to 'callback'. If
  there are any problems, just return the original buffer unmodified.

  Preserves the content type (png, jpeg, bmp) of the original image.
 */
function rotateImage(contentType, imgBuf, callback) {
    try {
        new Jimp(imgBuf, function (err, image) {
            if (err) {
                console.log('Image loading error: ' + err);
                callback(imgBuf);
            } else {
                image.rotate(180)
                .getBuffer(contentType, function (err, rotated) {
                    if (err) {
                        console.log('Image processing error: ' + err);
                        callback(imgBuf);
                    } else {
                        callback(rotated);
                    }
                });
            }
        });
    } catch (err) {
        /*
          Sometimes Jimp throws instead of passing error via the callback as it should.
          Sigh. e.g: "Image loading error: Error: Unsupported interlace method"
         */
        console.log('Jimp threw an error: ' + err);
        callback(imgBuf);
    }
}

proxy.use(function(clientReq, clientRes, next) {
    console.log('Proxying:', clientReq.url);

    proxy.forward(clientReq, clientRes, function(proxyReq) {
        proxyReq.on('response', function (response) {
            var supportedImageTypes = ['image/png', 'image/jpeg', 'image/bmp'],
                contentType = response.headers['content-type'],
                isModifiableImage = false;

            if(typeof contentType !== 'undefined') {
                if(contentType.indexOf(';') !== -1) {
                    contentType = contentType.split(';')[0].trim();
                }
                contentType = contentType.toLowerCase();
                contentType = contentType.replace('image/jpg', 'image/jpeg');
                if(supportedImageTypes.indexOf(contentType) !== -1) {
                    isModifiableImage = true;
                }
            }
            /*
              Note: check for 200 below is so we don't modify 304 "not modified" responses. Could
              also just delete all cache-control headers for the same effect.
             */
            if(isModifiableImage && response.statusCode === 200) {
                console.log('Modifying image: ' + clientReq.url);
                var transform = function(content, cb) {
                    rotateImage(contentType, content, function (result) {
                        cb(result);
                    });
                };
                helpers.sendModifiedResponse(clientRes, response, transform);
            } else {
                helpers.sendOriginalResponse(clientRes, response);
            }
        });
        proxyReq.on('error', function () {
            clientRes.end();
        });
    });
});

proxy.on('error', function (err) {
    console.log(err, err.stack.split('\n'));
});

proxy.listen(5555, 'localhost', function(err) {
    if(err) {
        console.log(err, err.stack.split('\n'));
        process.exit(1);
    }
});
