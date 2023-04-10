const express = require('express');
const db = require('../bdd/main');
const common = require('../common');

var bdd = null;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect(`http://${common.global.server.host}:${common.global.server.port}`);
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
        const entries = await db.selectRows(bdd, 'projects');
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
        const [entry] = await db.selectRows(bdd, 'projects', '*', 'id = ?', [id]);
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

app.listen(common.global.api.port, async () => {
    common.sucess(`Server listening on port ${common.global.api.port}`, 'api');
    bdd = await db.loadDatabase('dashium');
});