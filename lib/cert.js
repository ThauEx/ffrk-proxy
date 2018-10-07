const forge = require('node-forge');

exports.generateForHost = function(domain, altName, caCert, privateKey, serial, callback) {
  const privateCAKey = forge.pki.privateKeyFromPem(privateKey);
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const cert = forge.pki.createCertificate();

  caCert = forge.pki.certificateFromPem(caCert);

  cert.publicKey = keys.publicKey;
  cert.serialNumber = serial.toString();
  cert.validity.notBefore = new Date();
  cert.validity.notBefore.setDate(cert.validity.notBefore.getDate() - 1);
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 3);
  const attrs = [{
    name: 'commonName',
    value: domain,
  }, {
    name: 'organizationName',
    value: 'ffrk-proxy',
  }];

  cert.setSubject(attrs);
  cert.setIssuer(caCert.subject.attributes);
  cert.setExtensions([{
    name: 'subjectAltName',
    altNames: [{
      type: 6, // URI
      value: altName,
    }],
  }]);

  cert.sign(privateCAKey, forge.md.sha256.create());

  // PEM-format keys and cert
  const pem = {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert),
  };

  callback(null, pem);
};
