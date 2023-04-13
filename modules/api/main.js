const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const db = require('../bdd/main');
const common = require('../common');
const ci = require('../ci/main');
const path = require('path');

var bdd = null;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect(`http://${common.global.server.host}:${common.global.server.port}`);
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/public/favicon.ico'));
});

app.get('/global', async (req, res) => {
    try {
        var entries = await db.selectRows(bdd, 'global');
            entries[0].json = JSON.parse(entries[0].json);
        res.json(entries);
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/users', async (req, res) => {
    try {
        var entries = await db.selectRows(bdd, 'users');
        res.json(entries);
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// START PROJECT
// Route pour créer une nouvelle entrée dans la base de données
app.post('/projects', async (req, res) => {
    try {
        const { title, content } = req.body;
        const id = await db.insertRow(bdd, 'projects', { title, content });
        res.status(201).json({ id, title, content });
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer toutes les entrées de la base de données
app.get('/projects', async (req, res) => {
    try {
        var entries = await db.selectRows(bdd, 'projects');
        entries.forEach(proj => {
            proj.ci = JSON.parse(proj.ci);
            proj.docker = JSON.parse(proj.docker);
        });
        res.json(entries);
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer une entrée spécifique de la base de données
app.get('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        var [entry] = await db.selectRows(bdd, 'projects', '*', 'id = ?', [id]);
        if (!entry) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            entry.ci = JSON.parse(entry.ci);
            entry.docker = JSON.parse(entry.docker);
            res.json(entry);
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/projects/:id/ci', async (req, res) => {
    try {
        const { id } = req.params;
        var [entry] = await db.selectRows(bdd, 'projects', '*', 'id = ?', [id]);
        if (!entry) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            entry.ci = JSON.parse(entry.ci);
            entry.docker = JSON.parse(entry.docker);

            res.json({ run: entry.name });
            ci.runCI(entry.id);
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour mettre à jour une entrée spécifique de la base de données
app.put('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const changes = await db.updateRows(bdd, 'projects', { title, content }, 'id = ?', [id]);
        if (changes === 0) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.json({ id, title, content });
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour supprimer une entrée spécifique de la base de données
app.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const changes = await db.deleteRows(bdd, 'projects', 'id = ?', [id]);
        if (changes === 0) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});
// END PROJECT

// START CLUSTERS
// Route pour créer une nouvelle entrée dans la base de données
app.post('/clusters', async (req, res) => {
    try {
        const { title, content } = req.body;
        const id = await db.insertRow(bdd, 'clusters', { title, content });
        res.status(201).json({ id, title, content });
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer toutes les entrées de la base de données
app.get('/clusters', async (req, res) => {
    try {
        const entries = await db.selectRows(bdd, 'clusters');
        res.json(entries);
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour récupérer une entrée spécifique de la base de données
app.get('/clusters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [entry] = await db.selectRows(bdd, 'clusters', '*', 'id = ?', [id]);
        if (!entry) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.json(entry);
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour mettre à jour une entrée spécifique de la base de données
app.put('/clusters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const changes = await db.updateRows(bdd, 'clusters', { title, content }, 'id = ?', [id]);
        if (changes === 0) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.json({ id, title, content });
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour supprimer une entrée spécifique de la base de données
app.delete('/clusters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const changes = await db.deleteRows(bdd, 'clusters', 'id = ?', [id]);
        if (changes === 0) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});
// END CLUSTERS

// START LOGIN REGISTER
var SECRET_KEY = null;

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await db.selectRows(bdd, 'users', '*', 'email = ?', [email]);
        if (existingUser.length > 0) {
            common.warn('Email already exists', 'api');
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ajoute l'utilisateur à la base de données
        await db.insertRow(bdd, 'users', { email, password: hashedPassword });

        common.sucess('User created successfully', 'api');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifie si l'utilisateur existe
        const user = await db.selectRows(bdd, 'users', '*', 'email = ?', [email]);
        if (user.length == 0) {
            common.warn('Invalid email or password', 'api');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Vérifie si le mot de passe correspond
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            common.warn('Invalid email or password', 'api');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Génère un token JWT
        const token = jwt.sign({ userId: user[0].id }, SECRET_KEY);

        common.sucess('Login successful', 'api');

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});
// END LOGIN REGISTER

app.listen(common.global.api.port, async () => {
    common.sucess(`Server listening on port ${common.global.api.port}`, 'api');
    bdd = await db.loadDatabase('dashium');
    var entries = await db.selectRows(bdd, 'global');
        entries[0].json = JSON.parse(entries[0].json);
    
    SECRET_KEY = entries[0].json.server.encrypt;
});