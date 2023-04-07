const { exec } = require('child_process');
const fs = require('fs');

function runNpm(cmd, cipath, logpath, callback) {
    exec(`npm ${cmd}`, { cwd: cipath }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur: ${error.message}`);
            callback(error);
            return;
        }
        if (stderr) {
            console.error(`Erreur: ${stderr}`);
            callback(stderr);
            return;
        }
        fs.writeFile(`${logpath}/logs.txt`, stdout, (err) => {
            if (err) throw err;
        });
    });
}

function npm(cmd, cipath, logpath){
    runNpm(cmd.replace('npm', ''), cipath, logpath);
}

module.exports = {
    npm
}