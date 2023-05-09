/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/


const express = require('express');
const path = require('path');
const io = require('socket.io');
const common = require('../common');
const docker = require('../ci/docker');
const https = require('https');
const ssl = require('../ssl/main');

const SSLfile = ssl.getSSL();

const app = express();
const server = https.createServer(SSLfile, app);
const socket = io(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", `http://${common.global.server.host}`);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

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

app.get('/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm-addon-fit/lib/xterm-addon-fit.js'))
});

app.get('/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js.map', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm-addon-fit/lib/xterm-addon-fit.js.map'))
});

app.get('/node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js'))
});

app.get('/node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js.map', (req, res) => {
    res.sendFile(path.join(__dirname, '../../node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js.map'))
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
        if (data == null) {
            return;
        }
        if(data == 'dashiumDONE'){
            client.emit('done', 'data');
            return;
        }
        var out = data.split('\n');
        out.forEach((line) => {
            const output = {
                type: 'output',
                data: line,
            };
            client.emit('output', output);
        });
    }

    // Affichage des messages d'erreur
    function logError(data) {
        const output = {
            type: 'error',
            data: data.toString(),
        };
        client.emit('output', output);
        client.emit('done', 'error');
    }

    // Exécution d'une commande Docker
    client.on('command', async (containerName, command) => {
        try {
            const output = await docker.runCommandInContainer(containerName, command, null, logOutput);
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
