const account = require('../account/main');
const ci = require('../ci/main');
const common = require('../common');
const db = require('../bdd/main');
const express = require('express');
const path = require('path');

var bdd = null;
const app = express();
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
app.post('/register', async (req, res) => {
    try {
        var add = await account.registerUser(req.body);
        if(add.error != null){
            res.status(500).json(add);
        }
        if(add.message != null){
            res.status(201).json(add);
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        var get = await account.loginUser(req.body);
        if(get.error != null){
            res.status(500).json(get);
        }
        if(get.message != null){
            res.status(201).json(get);
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});
// END LOGIN REGISTER

app.listen(common.global.api.port, async () => {
    common.sucess(`Server listening on port ${common.global.api.port}`, 'api');
    bdd = await db.loadDatabase('dashium');
});