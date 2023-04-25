const { exec } = require('child_process');
const os = require('os');
const global = require('./main');
const common = require('../common');

function startScript() {
    common.log('Starting script...', '💖 heart', true);

    const process = exec('npm run build');

    process.stdout.on('data', (data) => {
        common.log(data, '💖 heart', true);
    });

    process.stderr.on('data', (data) => {
        common.error(data, '💖 heart', true);
    });

    process.on('close', (code) => {
        common.log(`Script exited with code ${code}. Restarting...`, '💖 heart', true);
        startScript();
    });

    global.setPID(process.pid);
}

function restartServer(pid) {
    if (os.platform() === 'win32') {
        // Windows
        exec(`taskkill /PID ${pid} /T /F`, (err, stdout, stderr) => {
            if (err) {
                common.error(err, '💖 heart', true);
                return;
            }
            common.log(`Server stopped with PID: ${pid}`, '💖 heart', true);
        });
    } else {
        // Unix / Mac
        exec(`kill ${pid}`, (err, stdout, stderr) => {
            if (err) {
                common.error(err, '💖 heart', true);
                return;
            }
            common.log(`Server stopped with PID: ${pid}`, '💖 heart', true);
        });
    }
}

module.exports = {
    restartServer,
    startScript
}