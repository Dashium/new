const express = require('express');
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const socket = io(server);

// Fonction pour exécuter les commandes Docker
function runDockerCommand(command, options, logFile = './logs.txt', client) {
    return new Promise((resolve, reject) => {
        const commandProcess = exec(`docker ${command}`, options);

        let logs = '';

        commandProcess.stdout.on('data', (data) => {
            logs += data;
            process.stdout.write(data);
            const output = {
                type: 'output',
                data: data,
            };
            client.emit('output', output);
            // if (logFile !== '') {
            //     fs.appendFileSync(logFile, data);
            // }
        });

        commandProcess.stderr.on('data', (data) => {
            logs += data;
            process.stderr.write(data);
            const output = {
                type: 'error',
                data: data,
            };
            client.emit('output', output);
            // if (logFile !== '') {
            //     fs.appendFileSync(logFile, data);
            // }
        });

        commandProcess.on('close', (code) => {
            if (code === 0) {
                resolve(logs.trim());
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

async function runCommandInContainer(containerName, command, client) {
    await runDockerCommand(`exec ${containerName} sh -c "${command}"`, null, null, client);
}

// Route pour afficher la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/:filename', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Connexion d'un client WebSocket
socket.on('connection', (client) => {
    console.log('Client connected');

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
            const output = await runCommandInContainer(containerName, command, client);
            logOutput(output);
        } catch (err) {
            logError(err.message);
        }
    });

    // Déconnexion d'un client WebSocket
    client.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Démarrage du serveur
const port = 3200;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
