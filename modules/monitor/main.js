/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
const app = require('express')();
const https = require('https');
const { exec } = require('child_process');
const docker = require('../ci/docker');
const common = require('../common');
const path = require('path');
const ssl = require('../ssl/main');

const SSLfile = ssl.getSSL();
const server = https.createServer(SSLfile, app);
const io = require('socket.io')(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", `http://${common.global.server.host}`);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// Déclaration d'un objet pour stocker les informations des conteneurs surveillés
const monitoredContainers = {};

app.get('/', (req, res) => {
    res.redirect(`http://${common.global.server.host}:${common.global.server.port}`);
});

app.get('/font', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/public/font/Heebo.css'));
});

app.get('/font/Heebo-Bold.ttf', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/public/font/Heebo-Bold.ttf'));
});


app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/public/favicon.ico'));
});

app.get('/:container', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Écouter l'événement 'monitor' pour recevoir le nom du container à surveiller
io.on('connection', (socket) => {
    common.log('Client connected', 'monitor');

    socket.on('monitor', (containerName) => {
        common.log(`Monitoring container "${containerName}"`, 'monitor');
        // Stocker les informations du conteneur surveillé associé au socketId de l'utilisateur
        monitoredContainers[socket.id] = containerName;
        try {
            docker.monitorDocker(containerName, io, socket.id);
        } catch (error) {
            common.error(error, 'monitor');
            io.to(socket.id).emit('data', "{'cpuUsage':'OFF', 'memoryUsage':'OFF', 'networkIn':'OFF / OFF'}")
        }
    });
    // Écouter l'événement 'disconnect' pour arrêter la surveillance du conteneur associé au socketId de l'utilisateur
    socket.on('disconnect', () => {
        common.log('Client disconnected', 'monitor');
        const containerName = monitoredContainers[socket.id];
        if (containerName) {
            common.log(`Stopping monitoring of container "${containerName}"`, 'monitor');
            // Arrêter la surveillance du conteneur
            // En envoyant un signal SIGINT à la commande 'docker stats'
            exec(`pkill -f "docker stats ${containerName}"`, (error, stdout, stderr) => {
                if (error) {
                    common.error(`Error stopping monitoring of container "${containerName}": ${error}`, 'monitor');
                }
                common.log(`Monitoring of container "${containerName}" stopped`, 'monitor');
            });
            delete monitoredContainers[socket.id];
        }
    });
});

server.listen(common.global.monitor.port, async () => {
    common.sucess(`Server listening on port ${common.global.monitor.port}`, 'monitor');
});