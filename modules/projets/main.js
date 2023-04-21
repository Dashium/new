const common = require('../common');
const clusters = require('../cluster/main');
const dbModule = require('../bdd/main');
const global = require('../global/main');

function getProjectByID(projectID) {
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        var [entry] = await dbModule.selectRows(db, 'projects', '*', 'id = ?', [projectID]);
            entry.ci = JSON.parse(entry.ci);
            entry.docker = JSON.parse(entry.docker);
            entry.repo = JSON.parse(entry.repo);
        resolve(entry);
    });
}

function getProjectByName(projectName) {
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        var [entry] = await dbModule.selectRows(db, 'projects', '*', 'alias = ?', [projectName]);
            entry.ci = JSON.parse(entry.ci);
            entry.docker = JSON.parse(entry.docker);
            entry.repo = JSON.parse(entry.repo);
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
    var currentPathRepo = `${current.cluster.path}/${current.alias}`;
    return {
        ci: `${currentPathRepo}/ci`,
        deploy: `${currentPathRepo}/deploy`,
        logs: `${currentPathRepo}/logs`,
        repo: `${currentPathRepo}/repo`
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
        var entries = await dbModule.selectRows(db, 'projects');
            entries.forEach(proj => {
                proj.ci = JSON.parse(proj.ci);
                proj.docker = JSON.parse(proj.docker);
            });
        resolve(entries);
    });
}

async function getProjectAllPorts(mode){
    if(mode == null){mode = "host";}
    var projects = await getProjectAll();
    var portsList = [];
    projects.forEach((val, id) => {
        let curr = val.docker.ports;
        if(typeof curr == 'object'){
            curr.forEach(element => {
                portsList.push(element[mode]);
            });
        }
    });
    return portsList;
}

async function getProjectPorts(id, mode){
    if(mode == null){mode = "host";}
    var project = await getProject(id);
    var portsList = [];
    let curr = project.docker.ports;
    if(typeof curr == 'object'){
        curr.forEach(element => {
            portsList.push(element[mode]);
        });
    }
    return portsList;
}

async function createProject(name, cluster, repo, owner) {
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
        id: null,
        alias: common.generateRandomString(common.global.alias.generator),
        ci: [],
        cluster: clusterID.id,
        deploy: {
            dockerID: common.generateRandomString(common.global.docker.IDgenerator),
            startCMD: ''
        },
        docker: {
            dockerID: common.generateRandomString(common.global.docker.IDgenerator),
            image: 'ubuntu:latest',
        },
        name,
        owner,
        path: common.getUrlLastPath(repo),
        repo: {
            mode: await github.detectRepoPrivacy(repo),
            url: repo
        }
    };

    await dbModule.insertRow(db, 'projects', {
        'alias': newproject.alias,
        'ci': JSON.stringify(newproject.ci),
        'cluster': newproject.cluster,
        'date': Date.now(),
        'deploy': JSON.stringify(newproject.deploy),
        'docker': JSON.stringify(newproject.docker),
        'lastupdate': Date.now(),
        'name': newproject.name,
        'owner': newproject.owner,
        'path': newproject.path,
        'repo': JSON.stringify(newproject.repo),
    })
    .then(async (id) => {
        newproject.id = id;
        var base = await getProjectDirs(id);
        await common.mkdir(base.ci);
        await common.mkdir(base.deploy);
        await common.mkdir(base.logs);
        await common.mkdir(base.repo);
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

async function updateProjet(id, data){
    var db = await dbModule.loadDatabase('dashium');
    const project = await dbModule.selectRows(db, 'projects', '*', 'id = ?', [id]);
    
    if (project.length == 0) {
        common.error(`Erreur : Aucun project avec l'ID ${id} n'a été trouvé`, 'project');
        return null;
    }

    if(data.docker != null){
        var current = JSON.parse(project[0].docker);
        var newParams = Object.keys(data.docker);
            newParams.forEach((val) => {
                current[val] = data.docker[val];
            });
        data = {};
        data.docker = JSON.stringify(current);
    }

    data.lastupdate = Date.now();

    await dbModule.updateRows(db, 'projects', data, 'id = ?', [id]);

    return project;
}

async function setCIScript(id, ciScript){
    var project = await updateProjet(id, { ci: JSON.stringify(ciScript) });

    common.sucess(`CI "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function setDockerImage(id, image){
    var project = await updateProjet(id, { docker: {image: image} });

    common.sucess(`Docker Image "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function addDockerUse(id, use){
    var current = await getProject(id);
    
    if(typeof current.docker.use != 'object'){
        current.docker.use = [];
    }
        current.docker.use.push(use);

    var project = await updateProjet(id, { docker: {use: current.docker.use} });

    common.sucess(`Docker Use "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function removeDockerUse(id, use){
    var current = await getProject(id);
    
    if(typeof current.docker.use != 'object'){
        current.docker.use = [];
    }
        current.docker.use = common.removeValueFromArray(current.docker.use, use);

    var project = await updateProjet(id, { docker: {use: current.docker.use} });

    common.sucess(`Docker Use "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function Portfinder(port, hostPORT){
    if(port == null){port = common.global.docker.ports.start;}
    if(hostPORT == null){hostPORT = await getProjectAllPorts();}

    var testPORT = await common.findAvailablePort(port, common.global.docker.ports.end);

        testPORT = await common.isHostPortUsed(testPORT, hostPORT);
    
    var globalPorts = await global.getPorts();

    if(globalPorts.includes(port)){
        testPORT == true;
    }

    if(testPORT == true){
        port++;
        return await Portfinder(port, hostPORT);
    }
    else {
        return port;
    }
}

async function addDockerPort(id, port){
    var current = await getProject(id);
    
    if(typeof current.docker.ports != 'object'){
        current.docker.ports = [];
    }
    var hostPORT = await Portfinder();

    global.addPort(hostPORT);

    current.docker.ports.push({ host: hostPORT, container: parseInt(port) });

    var project = await updateProjet(id, { docker: {ports: current.docker.ports} });

    common.sucess(`Docker Ports "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function removeDockerPort(id, port){
    var current = await getProject(id);
    
    if(typeof current.docker.ports != 'object'){
        current.docker.ports = [];
    }
        current.docker.ports = common.removeValueFromArray(current.docker.ports, port);
    
    global.removePort(port);

    var project = await updateProjet(id, { docker: {ports: current.docker.ports} });

    common.sucess(`Docker Ports "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function removeDockerEnv(id, env){
    var current = await getProject(id);
    
    if(typeof current.docker.env != 'object'){
        current.docker.env = [];
    }
        current.docker.env = common.removeValueFromArray(current.docker.env, env);

    var project = await updateProjet(id, { docker: {env: current.docker.env} });

    common.sucess(`Docker Env "${project[0].name}" mis a jour !`, 'project');

    return id;
}

async function addDockerEnv(id, env){
    var current = await getProject(id);
    
    if(typeof current.docker.env != 'object'){
        current.docker.env = [];
    }
        current.docker.env.push(env);

    var project = await updateProjet(id, { docker: {env: current.docker.env} });

    common.sucess(`Docker Env "${project[0].name}" mis a jour !`, 'project');

    return id;
}

module.exports = {
    addDockerEnv,
    addDockerPort,
    addDockerUse,
    createProject,
    getProject,
    getProjectAll,
    getProjectAllPorts,
    getProjectByID,
    getProjectByName,
    getProjectDirs,
    getProjectPorts,
    getProjectWithCluster,
    Portfinder,
    removeDockerEnv,
    removeDockerPort,
    removeDockerUse,
    removeProject,
    setCIScript,
    setDockerImage
}