const common = require('../common');
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const chokidar = require('chokidar');
const { graphqlHTTP } = require('express-graphql');
const API = require('./api');

// ---------
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// ----------

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = common.global.server.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', graphqlHTTP({
    schema: API.schema,
    rootValue: API.resolvers,
    graphiql: true,
}));

// ------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// ----------

chokidar.watch(path.join(__dirname, 'public'), { awaitWriteFinish: true }).on('all', (event, path) => {
    common.log('reloaded', 'webserver');
    io.emit('reload');
});

app.get('/', (req, res) => {
    var content = fs.readFileSync(__dirname + '/public/home/index.html');

    res.send(`
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();
            socket.on('reload', () => {
                window.location.reload();
            });
            function getData(query) {
                fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ query: query })
                })
                    .then(response => response.json())
                    .then(data => {
                        // Afficher les données sur le front-end
                        console.log(data);
                    })
                    .catch(error => {
                        // Gérer les erreurs
                        console.error(error);
                    });
            }
        </script>
        ${content.toString()}
    `);
});
// ---------
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB : '));
db.once('open', () => {
    common.sucess('Connexion à la base de données MongoDB établie.', 'mongobd');
});

// Définition du modèle de données utilisateur
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Configuration du middleware pour le parsing des données de formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Définition de la route pour l'affichage du formulaire d'inscription
app.get('/register', (req, res) => {
    res.send(`
    <form method="POST" action="/register">
      <div>
        <label>Nom d'utilisateur:</label>
        <input type="text" name="username" required>
      </div>
      <div>
        <label>Adresse e-mail:</label>
        <input type="email" name="email" required>
      </div>
      <div>
        <label>Mot de passe:</label>
        <input type="password" name="password" required>
      </div>
      <div>
        <button type="submit">S'inscrire</button>
      </div>
    </form>
  `);
});

// Définition de la route pour le traitement du formulaire d'inscription
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Vérification si l'utilisateur existe déjà en base de données
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            common.error(err, 'webserver] [register');
            res.status(500).send('Erreur de serveur');
        } else if (user) {
            res.status(400).send('Nom d\'utilisateur déjà utilisé');
        } else {
            // Création d'un nouvel utilisateur
            const newUser = new User({
                username: username,
                email: email,
                password: password
            });

            // Enregistrement de l'utilisateur en base de données
            newUser.save(err => {
                if (err) {
                    common.error(err, 'webserver] [register');
                    res.status(500).send('Erreur de serveur');
                } else {
                    res.redirect('/login');
                }
            });
        }
    });
});
// ---------

app.get('/:filename', (req, res) => {
    const filename = req.params.filename;

    if (fs.existsSync(__dirname + '/public/' + filename + '/index.html')) {
        var content = fs.readFileSync(__dirname + '/public/' + filename + '/index.html');
        res.send(`
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js"></script>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();
                socket.on('reload', () => {
                    window.location.reload();
                });
            </script>
            ${content.toString()}          
        `);
    }
    else {
        var content = '404 not found !';
        res.redirect('/');
    }
});

server.listen(port, () => {
    common.sucess(`Server started at http://${common.global.server.host}:${port}`, 'webserver');
});

io.on('connection', (socket) => {
    common.log('Nouvelle connexion WebSocket', 'websocket');

    socket.on('disconnect', () => {
        common.log('Déconnexion WebSocket', 'websocket');
    });
});