const common = require('../common');
const clusters = require('../cluster/main');
const clone = require('../clone/main');
const dbModule = require('../bdd/main');
const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, '../../config/projects.json');
var projects = require(projectPath);

// fs.watch(projectPath, () => {
//     try {
//         const data = fs.readFileSync(projectPath);
//         projects = JSON.parse(data);
//         common.log(`project chargé`, 'project');
//     } catch (err) {
//         common.error(`Erreur lors du chargement du project : ${err}`, 'project');
//     }
// });

function getProjectByID(projectID) {
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        const [entry] = await dbModule.selectRows(db, 'projects', '*', 'id = ?', [projectID]);
        resolve(entry);
    });
}

function getProjectByName(projectName) {
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        const [entry] = await dbModule.selectRows(db, 'projects', '*', 'alias = ?', [projectName]);
        resolve(entry);
    });
}

function getProject(projectIDorName) {
    if (typeof projectIDorName === 'number') {
        return getProjectByID(projectIDorName);
    } else if (typeof projectIDorName === 'string') {
        return getProjectByName(projectIDorName);
    } else {
        common.error(`Type de paramètre invalide pour getProject : ${typeof projectIDorName}`, 'cluster');
    }
}

async function getProjectDirs(id){
    var current = await getProjectWithCluster(id);
    var currentPathRepo = `${current.cluster.path}/${current.path}`;
    return {
        repo: `${currentPathRepo}/repo`,
        ci: `${currentPathRepo}/ci`,
        logs: `${currentPathRepo}/logs`
    };
}

async function getProjectWithCluster(projectID){
    let current = await getProject(projectID);
    if(typeof current.cluster == 'number'){
        current.cluster = await clusters.getCluster(current.cluster);
    }
    return current;
}

function getProjectAll(){
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        const entries = await dbModule.selectRows(db, 'projects');
        resolve(entries);
    });
}

async function createProject(name, cluster, repo) {
    var db = await dbModule.loadDatabase('dashium');
    const repoInUse = await dbModule.selectRows(db, 'projects', '*', 'repo = ?', [repo]);

    if (repoInUse.length > 0) {
        common.error(`Erreur : Le chemin ${repo} est déjà utilisé par un autre project`, 'project');
        return null;
    }

    var clusterID = await (await clusters.getCluster(cluster));
    if (clusterID == null) {
        common.error(`Erreur : Il n'y a aucun cluster dans la BDD`, 'project');
        return null;
    }
    if (clusterID.length == 0) {
        common.error(`Erreur : Le cluster ${cluster} n'existe pas`, 'project');
        return null;
    }

    const newproject = {
        name,
        alias: common.generateRandomString(common.global.alias.generator),
        cluster: clusterID.id,
        repo,
        path: common.getUrlLastPath(repo),
        ci: [],
        dockerID: common.generateRandomString(common.global.docker.IDgenerator),
    };

    await dbModule.insertRow(db, 'projects', {
        'name': newproject.name,
        'alias': newproject.alias,
        'cluster': newproject.cluster,
        'repo': newproject.repo,
        'path': newproject.path,
        'ci': newproject.ci,
        'dockerID': newproject.dockerID,
    })
    .then(async (id) => {
        var base = await getProjectDirs(id);
        await common.mkdir(base.ci);
        await common.mkdir(base.repo);
        await common.mkdir(base.logs);
    })
    .catch((err) => {
        console.log(err);
    });

    return newproject;
}

async function removeProject(id) {
    var db = await dbModule.loadDatabase('dashium');
    const project = await dbModule.selectRows(db, 'projects', '*', 'id = ?', [id]);

    if (project.length == 0) {
        common.error(`Erreur : Aucun project avec l'ID ${id} n'a été trouvé`, 'project');
        return null;
    }

    var projectID = await clusters.getCluster(project[0].cluster);
    
    if(projectID == null){
        common.error('project id is not found !', 'project')
        return false;
    }

    common.rmdir(`${projectID.path}/${project[0].path}`);

    await dbModule.deleteRows(db, 'projects', 'id = ?', [id]);

    common.sucess(`Project "${project[0].name}" supprimé`, 'project');

    return project;
}

async function setCIScript(id, ciScript){
    var db = await dbModule.loadDatabase('dashium');
    const project = await dbModule.selectRows(db, 'projects', '*', 'id = ?', [id]);

    if (project.length == 0) {
        common.error(`Erreur : Aucun project avec l'ID ${id} n'a été trouvé`, 'project');
        return null;
    }

    await dbModule.updateRows(db, 'projects', { ci: JSON.stringify(ciScript) }, 'id = ?', [id]);

    common.sucess(`Project "${project[0].name}" supprimé`, 'project');

    return project;
}

module.exports = {
    getProject,
    getProjectDirs,
    getProjectAll,
    getProjectByID,
    getProjectByName,
    getProjectWithCluster,
    setCIScript,
    createProject,
    removeProject
}