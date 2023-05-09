/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
const fs = require('fs');
const github = require('../modules/clone/github');
const global = require('../modules/global/main');
const os = require('os');
const { spawn } = require('child_process');

function startDocker() {
    if (os.platform() === 'win32') {
        const child = spawn('cmd.exe', ['/c', 'sc', 'start', 'Docker']);
        child.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Docker failed to start with error code ${code}`);
            }
        });
    } else if (os.platform() === 'darwin') {
        const child = spawn('open', ['-g', '-a', 'Docker']);
        child.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Docker failed to start with error code ${code}`);
            }
        });
    } else {
        const child = spawn('sudo', ['systemctl', 'start', 'docker']);
        child.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Docker failed to start with error code ${code}`);
            }
        });
    }
}
startDocker();

async function setSHA() {
    var sha = await github.getLatestCommitSha('./');
    await global.updateSHA(sha);
}

if (fs.existsSync('./config/dashium.db')) {
    setSHA();
}