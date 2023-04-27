const { exec } = require('child_process');
const os = require('os');
const global = require('./main');
const common = require('../common');
const autorestart = process.argv[2] == '--norestart' ? false : true;

function startScript() {
    if(autorestart == false){
        common.warn('Auto restart is set to FALSE !', '💖 heart');
    }
    common.log('Starting script...', '💖 heart');

    const process = exec('npm run build');

    process.stdout.on('data', (data) => {
        common.log(data, '💖 heart');
    });

    process.stderr.on('data', (data) => {
        common.error(data, '💖 heart');
    });

    process.on('close', (code) => {
        common.log(`Script exited with code ${code}. Restarting...`, '💖 heart');
        if(autorestart == true){
            startScript();
        }
        else{
            process.exit(0);
        }
    });

    global.setPID(process.pid);
}

function restartServer(pid) {
    if (os.platform() === 'win32') {
        // Windows
        exec(`taskkill /PID ${pid} /T /F`, (err, stdout, stderr) => {
            if (err) {
                common.error(err, '💖 heart');
                return;
            }
            common.log(`Server stopped with PID: ${pid}`, '💖 heart');
        });
    } else {
        // Unix / Mac
        // exec(`sudo kill ${pid}`, (err, stdout, stderr) => {
        //     if (err) {
        //         common.error(err, '💖 heart');
                exec(`sudo systemctl restart dashium`, (err, stdout, stderr) => {
                    if (err) {
                        common.error(err, '💖 heart');
                        return;
                    }
                    common.log(`Server stopped with systemCTL`, '💖 heart');
                });
            //     return;
            // }
            // common.log(`Server stopped with PID: ${pid}`, '💖 heart');
        // });
    }
}

module.exports = {
    restartServer,
    startScript
}