var forge = require('node-forge');

exports.generateForHost = function(domain, altName, caCert, privateKey, serial, callback) {
    var caCert = forge.pki.certificateFromPem(caCert);
    var privateCAKey = forge.pki.privateKeyFromPem(privateKey);
    var keys;
    var cert;

    //console.log('Generating 1024-bit key-pair...');
    keys = forge.pki.rsa.generateKeyPair(1024);
    //console.log('Key-pair created.');
    //console.log('Creating self-signed certificate...');
    cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = serial.toString();
    cert.validity.notBefore = new Date();
    cert.validity.notBefore.setDate(cert.validity.notBefore.getDate() - 1);
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
        name: 'commonName',
        value: domain
    }, {
        name: 'organizationName',
        value: 'ffrk-proxy'
    }];

    cert.setSubject(attrs);
    cert.setIssuer(caCert.subject.attributes);
    cert.setExtensions([{
        name: 'subjectAltName',
        altNames: [{
            type: 6, // URI
            value: altName
        }]
    }]);

    //console.log(privateKey);
    cert.sign(privateCAKey, forge.md.sha256.create());
    //console.log('Certificate created.');

    // PEM-format keys and cert
    var pem = {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert)
    };

    //console.log('\nKey-Pair:');
    //console.log(pem.privateKey);
    //console.log(pem.publicKey);

    //console.log('\nCertificate:');
    //console.log(pem.certificate);
    callback(null, pem);
}
