/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

const { exec } = require('child_process');
const os = require('os');
const global = require('./main');
const common = require('../common');
const ssl = require('../ssl/main');

const autorestart = process.argv[2] == '--norestart' ? false : true;

function startScript() {
    if(autorestart == false){
        common.warn('Auto restart is set to FALSE !', '💖 heart');
    }
    common.log('Starting script...', '💖 heart');

    ssl.createSSL();

    const heart = exec('npm run build');

    heart.stdout.on('data', (data) => {
        common.log(data, '💖 heart');
    });

    heart.stderr.on('data', (data) => {
        common.error(data, '💖 heart');
    });

    heart.on('close', (code) => {
        common.log(`Script exited with code ${code}. Restarting...`, '💖 heart');
        if(autorestart == true){
            startScript();
        }
        else{
            process.exit(0);
        }
    });

    global.setPID(heart.pid);
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