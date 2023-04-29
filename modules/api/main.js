const account = require('../account/main');
const ci = require('../ci/main');
const common = require('../common');
const db = require('../bdd/main');
const express = require('express');
const global = require('../global/main');
const github = require('../clone/github');
const https = require('https');
const integration = require('../integration/main');
var multer = require('multer');
const os = require('os');
const path = require('path');
const project = require('../projets/main');
const ssl = require('../ssl/main');
const upload = multer({ dest: 'uploads/' });

var bdd = null;
const app = express();
app.use(express.json());

const SSLfile = ssl.getSSL();

var frontEND = `https://${common.global.server.host}:${common.global.server.port}`;
if (os.platform() != 'win32') { frontEND = `https://${common.global.server.host}` }

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", frontEND);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

async function verifyTOKEN(req, res, nosend) {
    try {
        const token = req.body.token;
        const code = await account.verifyToken(token);

        if(code.error != null){
            if (nosend == null) {
                res.status(200).json({ error: 'Invalid token' });
            }
            return false;
        }

        if(code.message != null){
            if (nosend == null) {
                res.status(200).json({ message: 'Token is valid' });
            }
            return true;
        }
    } catch (error) {
        common.error(error, 'api');
        if (nosend == null) {
            res.status(500).json({ error: 'Internal server error' });
        }
        return false;
    }
}

app.get('/', (req, res) => {
    res.redirect(`https://${common.global.server.host}:${common.global.server.port}`);
});

app.get('/restart', (req, res) => {
    global.restartServer();
    res.sendFile(path.join(__dirname, '../dashboard/public/favicon.ico'));
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/public/favicon.ico'));
});

app.get('/global', async (req, res) => {
    try {
        var entries = await db.selectRows(bdd, 'global');
        entries[0].json = JSON.parse(entries[0].json);
        delete entries[0].json.server.encrypt;
        delete entries[0].json.pid;
        res.json(entries);
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/update', async (req, res) => {
    try {
        await github.updateRepo('./');
        var sha = await github.getLatestCommitSha('./');
        await global.updateSHA(sha);
        setTimeout(() => {
            global.restartServer();
        }, 60000);
        res.json({ msg: 'OK !' });
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
            proj.date = common.timestampToString(proj.date);
            proj.deploy = JSON.parse(proj.deploy);
            proj.docker = JSON.parse(proj.docker);
            proj.lastupdate = common.timestampToString(proj.lastupdate);
            proj.repo = JSON.parse(proj.repo);
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
            entry.date = common.timestampToString(entry.date);
            entry.docker = JSON.parse(entry.docker);
            entry.lastupdate = common.timestampToString(entry.lastupdate);
            entry.repo = JSON.parse(entry.repo);
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
        if (add.error != null) {
            res.status(201).json(add);
        }
        if (add.message != null) {
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
        if (get.error != null) {
            res.status(201).json(get);
        }
        if (get.message != null) {
            res.status(201).json(get);
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/check-token', async (req, res) => {
    await verifyTOKEN(req, res);
});
// END LOGIN REGISTER

// START INTEGRATION
app.post('/get_repos', async (req, res) => {
    try {
        const service = req.body.service;
        const repos = await integration.getRepos(service);
        if (repos) {
            res.send(repos);
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        common.error(error, 'api');
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/add_integ', upload.single('privateKey'), (req, res) => {
    const { selectedPlatform, appId, privateKey, baseUrl, username, password } = req.body;

    // if (!selectedPlatform || !appId || !privateKey || !baseUrl || !username || !password) {
    //     return res.status(201).send('Toutes les données requises ne sont pas fournies');
    // }
    // console.log(selectedPlatform, appId, privateKey, baseUrl, username, password);

    switch (selectedPlatform) {
        case 'github':
            if (!appId || !req.file.path) {
                return res.status(201).json({ message: 'Toutes les données requises ne sont pas fournies' });
            }
            common.copyFile(req.file.path, `./config/${selectedPlatform}.pem`);
            integration.addIntegration('github', appId);
            break;
        case 'docker':
            if (!username || !password) {
                return res.status(201).json({ message: 'Toutes les données requises ne sont pas fournies' });
            }
            integration.addIntegration('docker', username, password);
            break;
        default:
            return res.status(201).json({ message: 'Toutes les données requises ne sont pas fournies' });
    }

    res.status(201).json({ message: 'Intégration ajoutée avec succès' });
});
// END INTEGRATION

// START PROJECT
app.post('/add_project', async (req, res) => {
    const current = req.body;
    console.log(current);
    const { id } = await project.createProject(current.projectName, parseInt(current.cluster), current.selectedProject, 'root@local');
    console.log(id);

    await project.setDockerImage(id, current.selectedImage);
    await project.addDockerUse(id, 'dashium');
    await project.addDockerUse(id, current.selectedLanguage);

    await current.ports.forEach(async (curr) => {
        await project.addDockerPort(id, curr.port);
    });

    await current.envVars.forEach(async (curr) => {
        await project.addDockerEnv(id, `${curr.name}:${curr.value}`);
    });

    var script = current.commands.split('\n');

    await script.forEach(async (val) => {
        await project.addCIcmd(id, 'no name', val);
    });

    setTimeout(() => {
        ci.runCI(id);
    }, 5000);
});
// END PROJECT
if (SSLfile != null) {
    https.createServer(SSLfile, app).listen(common.global.api.port, async () => {
        common.sucess(`Server listening on port ${common.global.api.port}`, 'api');
        bdd = await db.loadDatabase('dashium');
    });
}
else {
    app.listen(common.global.api.port, async () => {
        common.sucess(`Server listening on port ${common.global.api.port}`, 'api');
        bdd = await db.loadDatabase('dashium');
    });
}