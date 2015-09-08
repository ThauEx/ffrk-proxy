
var fs = require('fs'),
    Promise = require('bluebird'),
    pem = require('pem'),
    tls = require('tls'),
    zlib = require('zlib');

/**
 * Get a stream transform to decompress an HTTP response (or null, if none required).
 *
 * NOTE: Does not handle 'compress', but in practice no-one has used that since the 90's.
 *
 * @param {http.ServerResponse} response - The server response to get a decompressor for.
 * @returns {*} - A stream.Transform, or null if no decompression required.
 */
function decompressorFor(response) {
    var contentEncoding = response.headers['content-encoding'];
    switch (contentEncoding) {
        case 'x-gzip':
        case 'gzip':
            return zlib.createGunzip();
        case 'deflate':
            return zlib.createInflate();
        default:
            return null;
    }
}

/**
 * Transform the server's response and send it to the proxy client.
 *
 * @param {http.ServerResponse} clientRes - Response to the client.
 * @param {http.IncomingMessage} response - Response from the server.
 * @param {transformCallback} transform - How to transform the server's response.
 */
function sendModifiedResponse(clientRes, response, transform) {
    var dataPipe = response,
        decompressor = decompressorFor(response),
        chunks = [];

    if(decompressor) {
        dataPipe = dataPipe.pipe(decompressor);
    }
    dataPipe.on('data', function(chunk) {
        chunks.push(chunk);
    });
    dataPipe.on('end', function () {
        var origContent = Buffer.concat(chunks);
        transform(origContent, function (modifiedContent) {
            response.headers['content-length'] = modifiedContent.length;
            // The response has been de-chunked and uncompressed, so delete
            // these headers from the response.
            delete response.headers['content-encoding'];
            delete response.headers['content-transfer-encoding'];
            clientRes.writeHead(response.statusCode, response.headers);
            clientRes.end(modifiedContent);
        });
    });
}

/**
 * Transform server response content.
 *
 * There's no error value, because even if the transform fails, *something* should be returned
 * to the client. Figuring out what that should be is application-specific (i.e, your problem).
 *
 * @callback transformCallback
 * @param {Buffer} input - The server's response content.
 * @returns {Buffer} - The transformed response.
 */


/**
 * Send a server response to the proxy client as-is, without modification.
 *
 * @param {http.ServerResponse} clientRes - Response to the client.
 * @param {http.IncomingMessage} response - Response from the server (to send).
 */
function sendOriginalResponse(clientRes, response) {
    clientRes.writeHead(response.statusCode, response.headers);
    response.pipe(clientRes);
}

/**
 * Return an SNICallback to dynamically generate certificates signed by a CA.
 *
 * This allows you to install 'dummy.crt' as a root cert once, and then access all TLS sites
 * without any further warnings from your browser.
 *
 * NOTE: This only works in node 0.12; in older versions it is not possible to generate certs
 *       asynchronously, because there was no callback argument for SNICallback.
 * NOTE: The OpenSSL command must be in your $PATH for the 'pem' library to work.
 * NOTE: No cache eviction is implemented, this will eventually run out of memory if
 *       implemented "as is" in a long-running process.
 */
function makeSNICallback() {
    var caKey = fs.readFileSync(__dirname + '/../cert/dummy.key', 'utf8'),
        caCert = fs.readFileSync(__dirname + '/../cert/dummy.crt', 'utf8'),
        serial = Math.floor(Date.now() / 1000),
        cache = {};

    var ver = process.version.match(/^v(\d+)\.(\d+)/);
    var canUseSNI = ver[1] > 1 || ver[2] >= 12; // >= 0.12.0
    console.log('Per-site certificate generation is: ' + (canUseSNI ? 'ENABLED' : 'DISABLED'));
    console.log('Feature requires SNI support (node >= v0.12), running version is: ' + ver[0]);

    if(!canUseSNI) {
        return undefined;
    }
    var createCertificateAsync = Promise.promisify(pem.createCertificate);

    return function SNICallback(servername, cb) {
        if(!cache.hasOwnProperty(servername)) {
            // Slow path, put a promise for the cert into cache. Need to increment
            // the serial or browsers will complain.
            console.log('Generating new TLS certificate for: ' + servername);
            var certOptions = {
                commonName: servername,
                serviceKey: caKey,
                serviceCertificate: caCert,
                serial: serial++,
                days: 3650
            };
            cache[servername] = createCertificateAsync(certOptions).then(function (keys) {
                return tls.createSecureContext({
                    key: keys.clientKey,
                    cert: keys.certificate,
                    ca: caCert
                }).context;
            });
        }
        cache[servername].then(function (ctx) {
            cb(null, ctx);
        }).catch(function (err) {
            console.log('Error generating TLS certificate: ', err);
            cb(err, null);
        });
    }
}

module.exports = {
    sendModifiedResponse: sendModifiedResponse,
    sendOriginalResponse: sendOriginalResponse,
    makeSNICallback: makeSNICallback
};

