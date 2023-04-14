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
