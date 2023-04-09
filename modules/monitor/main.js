const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { exec } = require('child_process');
const docker = require('../ci/docker');
const common = require('../common');

// Déclaration d'un objet pour stocker les informations des conteneurs surveillés
const monitoredContainers = {};

// Fonction qui renvoie les données d'un container
function getContainerStats(containerName, socketId) {
    return new Promise((resolve, reject) => {
        var format = `{'cpuUsage': '{{.CPUPerc}}','memoryUsage': '{{.MemUsage}}','networkIn': '{{.NetIO}}'}`;
        const cmd = `docker stats ${containerName} --format "${format}"`;
        const process = exec(cmd);

        let logs = '';

        process.stdout.on('data', (data) => {
            logs += data;
            // Envoyer les données au client via le socket correspondant
            io.to(socketId).emit('data', common.replaceAll(data, "'", '"'));
        });

        process.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            // Envoyer un message d'erreur au client via le socket correspondant
            io.to(socketId).emit('data', common.replaceAll("{'cpuUsage':'OFF', 'memoryUsage':'OFF', 'networkIn':'OFF / OFF'}", "'", '"'))
            resolve(data);
        });

        process.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
            resolve(logs.trim());
        });
    });
}

app.get('/', (req, res) => {
    res.redirect(`http://${common.global.server.host}:${common.global.server.port}`);
});

// Route pour envoyer la page HTML avec le client socket.io
app.get('/:container', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Écouter l'événement 'monitor' pour recevoir le nom du container à surveiller
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('monitor', (containerName) => {
        console.log(`Monitoring container "${containerName}"`);
        // Stocker les informations du conteneur surveillé associé au socketId de l'utilisateur
        monitoredContainers[socket.id] = containerName;
        try {
            getContainerStats(containerName, socket.id);
        } catch (error) {
            console.log(error);
            io.to(socket.id).emit('data', "{'cpuUsage':'OFF', 'memoryUsage':'OFF', 'networkIn':'OFF / OFF'}")
        }
    });
    // Écouter l'événement 'disconnect' pour arrêter la surveillance du conteneur associé au socketId de l'utilisateur
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const containerName = monitoredContainers[socket.id];
        if (containerName) {
            console.log(`Stopping monitoring of container "${containerName}"`);
            // Arrêter la surveillance du conteneur
            // En envoyant un signal SIGINT à la commande 'docker stats'
            exec(`pkill -f "docker stats ${containerName}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error stopping monitoring of container "${containerName}": ${error}`);
                }
                console.log(`Monitoring of container "${containerName}" stopped`);
            });
            delete monitoredContainers[socket.id];
        }
    });
});

server.listen(common.global.monitor.port, () => {
    console.log(`Server listening on port ${common.global.monitor.port}`);
});