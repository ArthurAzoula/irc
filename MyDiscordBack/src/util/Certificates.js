const fs = require('fs');
const { createCA, createCert } = require('mkcert');
const serverConfig = require('../config/server.config');
const dir = serverConfig['certification']['dir'];
const caFileCrt = `${dir}/${serverConfig['certification']['caName']}.crt`;
const caFileKey = `${dir}/${serverConfig['certification']['caName']}.key`;
const certFileCrt = `${dir}/${serverConfig['certification']['certName']}.crt`;
const certFileKey = `${dir}/${serverConfig['certification']['certName']}.key`;

const generateCertificate = async () => {
  const ca = await createCA(serverConfig['CA']);
  const cert = await createCert({
      ...serverConfig['CERT'],
      ca: { key: ca.key, cert: ca.cert },
  });
  
  fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(caFileKey, ca.key);
  fs.writeFileSync(caFileCrt, ca.cert);
  
  fs.writeFileSync(certFileKey, cert.key);
  fs.writeFileSync(certFileCrt, cert.cert);
}

const getCertificate = async () => {
  if(!fs.existsSync(caFileCrt) || !fs.existsSync(caFileKey) || !fs.existsSync(certFileCrt) || !fs.existsSync(certFileKey)){
    await generateCertificate();
  }
  
  const cert = {
    key: fs.readFileSync(certFileKey),
    cert: fs.readFileSync(certFileCrt)
  };
  
  return cert;
}

module.exports = { generateCertificate, getCertificate };