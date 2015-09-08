var forge = require('node-forge'),
    fs = require('fs');

console.log('Generating 2048-bit key-pair...');
var keys = forge.pki.rsa.generateKeyPair(2048);
console.log('Key-pair created.');
console.log('Creating self-signed certificate...');
var cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
var attrs = [{
    name: 'commonName',
    value: 'ffrk-proxy'
}, {
    name: 'organizationName',
    value: 'ffrk-proxy'
}];
cert.setSubject(attrs);
cert.setIssuer(attrs);

cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
}, {
    name: 'subjectKeyIdentifier'
}, {
    name: 'authorityKeyIdentifier'
}]);

// self-sign certificate
cert.sign(keys.privateKey, forge.md.sha256.create());
console.log('Certificate created.');

// PEM-format keys and cert
var pem = {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert)
};


console.log('\nKey-Pair:');
console.log(pem.privateKey);
console.log(pem.publicKey);

console.log('\nCertificate:');
console.log(pem.certificate);

fs.writeFileSync(__dirname + "/../dump/rootCA-" + Date.now() + ".key", pem.privateKey);
fs.writeFileSync(__dirname + "/../dump/rootCA-" + Date.now() + ".pub.key", pem.publicKey);
fs.writeFileSync(__dirname + "/../dump/rootCA-" + Date.now() + ".crt", pem.certificate);
