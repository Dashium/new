const { exec } = require('child_process');
const common = require('../common');
const fs = require('fs');
const os = require('os');
const path = require('path');

function sslFile() {
    return {
        key: path.join(__dirname, '../../config/ssl/dashium.key'),
        cert: path.join(__dirname, '../../config/ssl/dashium.crt'),
    }
}

async function createSSL() {
    const domain = await common.global.server.host;
    const days = 365;
    const keyFileName = sslFile().key;
    const certFileName = sslFile().cert;

    common.mkdir('config/ssl');

    if (fs.existsSync(keyFileName)) {
        common.log('SSL certificate already exist !', 'ssl');
        return;
    }
    var sslCreator = `sudo openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=${domain}/O=dashium/OU=dashium' -keyout ${keyFileName} -days ${days} -out ${certFileName}`;
    if (os.platform() == 'win32') {
        sslCreator = `"C:\\Program Files\\Git\\usr\\bin\\openssl.exe" req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=${domain}/O=dashium/OU=dashium' -keyout ${keyFileName} -days ${days} -out ${certFileName}`;
    }

    exec(
        sslCreator,
        {
            cwd: __dirname,
            env: {
                ...process.env,
                COMMON_NAME: domain,
            },
        },
        (error, stdout, stderr) => {
            if (error) {
                common.error(`Error while generating SSL certificate: ${error.message}`, 'ssl');
                return;
            }
            if (stderr) {
                common.error(`Error while generating SSL certificate: ${stderr}`, 'ssl');
                return;
            }
            common.log('SSL certificate generated successfully', 'ssl');
        },
    );
}

function getSSL() {
    const SSLfile = {
        key: null,
        cert: null
    };
    if (fs.existsSync(sslFile().key)) {
        SSLfile.key = fs.readFileSync(sslFile().key);
    }
    if (fs.existsSync(sslFile().cert)) {
        SSLfile.cert = fs.readFileSync(sslFile().cert);
    }
    return SSLfile;
}

module.exports = {
    createSSL,
    sslFile,
    getSSL
}