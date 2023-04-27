const fs = require('fs');
const path = require('path');
const net = require('net');
const os = require('os');

var globalPath = path.join(__dirname, '../config/global.json');
if (fs.existsSync(globalPath) == true) {
    var global = require(globalPath);
}
else {
    var global = null;
}

const currentDate = replaceAll(new Date().toISOString(), ':', '-');
const logFile = createLogFile(`logs/${currentDate}.txt`);

function getHostname() {
    return os.hostname();
}

function mkdir(path) {
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            logFile.log(`Erreur lors de la création du répertoire ${path} : ${err}`, 'error', 'common');
        } else {
            logFile.log(`Répertoire créé : ${path}`, 'info', 'common');
        }
    });
}

function rmdir(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            try {
                if (fs.lstatSync(filePath).isDirectory()) {
                    return rmdir(filePath);
                } else {
                    return rmfile(filePath);
                }
            } catch (error) {
                logFile.log(`Impossible de supprimé "${dirPath}"`, 'error', 'common');
            }
        });
        try {
            fs.rmdirSync(dirPath);
            logFile.log(`Répertoire "${dirPath}" supprimé`, 'warn', 'common');
        } catch (error) {
            logFile.log(`Impossible de supprimé "${dirPath}"`, 'error', 'common');
        }
    }
}

function rmfile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                logFile.log(`Erreur: ${err}`, 'error', 'common');
                return false;
            } else {
                logFile.log(`Fichier "${filePath}" supprimé`, 'warn', 'common');
                return true;
            }
        });
    }
}

function copyDir(src, dest) {
    // Créer le répertoire de destination s'il n'existe pas encore
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    // Récupérer les fichiers et sous-répertoires du répertoire source
    const files = fs.readdirSync(src);

    // Parcourir chaque fichier et sous-répertoire
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        // Vérifier si le fichier est un répertoire
        if (fs.statSync(srcPath).isDirectory()) {
            // Si c'est le cas, copier le répertoire de manière récursive
            copyDir(srcPath, destPath);
        } else {
            // Si c'est un fichier, le copier simplement dans le répertoire de destination
            fs.copyFileSync(srcPath, destPath);
        }
    }
    logFile.log(`Répertoire "${src}" copier`, 'warn', 'common');
}

function copyFile(source, destination) {
    logFile.log(`Fichier "${source}" copier dans ${destination}`, 'warn', 'common');
    fs.copyFileSync(source, destination);
}

function createLogFile(filePath) {
    if (!fs.existsSync(filePath.split('/')[0])) { mkdir(filePath.split('/')[0]); }
    const stream = fs.createWriteStream(filePath, { flags: 'a' });

    function log(msg, type, module) {
        if(module == null){module = 'undefined';}
        const colorMap = {
            'info': '\x1b[34m',
            'sucess': '\x1b[32m',
            'warn': '\x1b[33m',
            'error': '\x1b[31m'
        };

        const timestamp = new Date().toISOString();
        const color = colorMap[type] || colorMap['info'];
        const resetColor = '\x1b[0m';
        const logMsg = `[${timestamp}] [${module.toUpperCase()}] ${msg}`;

        console.log(`${color}${logMsg}${resetColor}`);
        stream.write(`[${type.toUpperCase()}] ${logMsg}\n`);
    }

    return { log };
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getUrlLastPath(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

function getDomains(url) {
    const parts = url.split('/');
    if (parts.length > 2 && parts[0].startsWith('http')) {
        return parts[2];
    } else {
        return null;
    }
}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function formatJsonToArray(jsonObj) {
    const formattedProjects = [];
    Object.keys(jsonObj).forEach((key) => {
        formattedProjects.push(jsonObj[key]);
    });
    return formattedProjects;
}

function removeValueFromArray(array, value) {
    return array.filter((item) => item !== value);
}

function timestampToString(timestamp) {
        timestamp = parseInt(timestamp);
        timestamp = Math.ceil(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedDate = month + ' ' + day + ', ' + year + ' at ' + hours + ':' + minutes + ' ' + ampm;
    return formattedDate;
}

function isPortInUse(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer((socket) => {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });

        server.listen(port, '127.0.0.1');
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                reject(err);
            }
        });
        server.on('listening', () => {
            server.close();
            resolve(false);
        });
    });
}

function findAvailablePort(startPort = 3000, endPort = 3999) {
    return new Promise((resolve, reject) => {
        let port = startPort;
        const testNextPort = () => {
            if (port > endPort) {
                reject(new Error(`No available port found in range ${startPort}-${endPort}`));
                return;
            }
            const tester = net.createServer()
                .once('error', () => {
                    port++;
                    tester.close();
                    testNextPort();
                })
                .once('listening', () => {
                    tester.close();
                    resolve(port);
                })
                .listen(port, 'localhost');
        };
        testNextPort();
    });
}

function isHostPortUsed(hostPort, portsConfig) {
    for (let port of portsConfig) {
        if (port === hostPort) {
            return true;
        }
    }
    return false;
}

module.exports = {
    copyDir,
    copyFile,
    error: (msg, from) => { logFile.log(msg, 'error', from); },
    findAvailablePort,
    formatJsonToArray,
    generateRandomString,
    getDomains,
    getHostname,
    getUrlLastPath,
    global,
    isHostPortUsed,
    isPortInUse,
    log: (msg, from) => { logFile.log(msg, 'info', from); },
    mkdir,
    removeValueFromArray,
    replaceAll,
    rmdir,
    rmfile,
    sucess: (msg, from) => { logFile.log(msg, 'sucess', from); },
    timestampToString,
    warn: (msg, from) => { logFile.log(msg, 'warn', from); }
}