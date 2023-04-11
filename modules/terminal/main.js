const express = require('express');
const http = require('http');
const path = require('path');
const io = require('socket.io');
const common = require('../common');
const docker = require('../ci/docker');

const app = express();
const server = http.createServer(app);
const socket = io(server);

// Route pour afficher la page d'accueil
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    res.redirect(`http://${common.global.server.host}:${common.global.server.port}`);
});

// START IMPORT TERMINAL
app.get('/node_modules/xterm/css/xterm.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm/css/xterm.css'))
});

app.get('/node_modules/xterm/lib/xterm.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm/lib/xterm.js'))
});

app.get('/node_modules/xterm/lib/xterm.js.map', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm/lib/xterm.js.map'))
});
// END IMPORT TERMINAL

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/public/favicon.ico'));
});

app.get('/:filename', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Connexion d'un client WebSocket
socket.on('connection', (client) => {
    common.log('Client connected', 'Terminal');

    // Affichage des messages de la console SSH
    function logOutput(data) {
        const output = {
            type: 'output',
            data: data,
        };
        client.emit('output', output);
    }

    // Affichage des messages d'erreur
    function logError(data) {
        const output = {
            type: 'error',
            data: data.toString(),
        };
        client.emit('output', output);
    }

    // Exécution d'une commande Docker
    client.on('command', async (containerName, command) => {
        try {
            const output = await docker.runCommandInContainer(containerName, command, null, client);
            logOutput(output);
        } catch (err) {
            logError(err.message);
        }
    });

    // Déconnexion d'un client WebSocket
    client.on('disconnect', () => {
        common.log('Client disconnected', 'Terminal');
    });
});

// Démarrage du serveur
const port = common.global.ssh.port;
server.listen(port, () => {
    common.sucess(`Terminal server listening on port ${port}`, 'Terminal');
});
