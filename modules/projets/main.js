const common = require('../common');
const clusters = require('../cluster/main');
const clone = require('../clone/main');
const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, '../../config/projects.json');
var projects = require(projectPath);

fs.watch(projectPath, () => {
    try {
        const data = fs.readFileSync(projectPath);
        projects = JSON.parse(data);
        common.log(`project chargé`, 'project');
    } catch (err) {
        common.error(`Erreur lors du chargement du project : ${err}`, 'project');
    }
});

function getProjectByID(projectID) {
    for (const key in projects) {
        if (projects[key].id === projectID) {
            return projects[key];
        }
    }
    return null;
}

function getProjectByName(projectName) {
    for (const key in projects) {
        if (projects[key].name === projectName) {
            return projects[key];
        }
    }
    return null;
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

function getProjectDirs(id){
    var current = getProjectWithCluster(id);
    var currentPathRepo = `${current.cluster.path}/${current.path}`;
    return {
        repo: `${currentPathRepo}/repo`,
        ci: `${currentPathRepo}/ci`,
        logs: `${currentPathRepo}/logs`
    };
}

function getProjectWithCluster(projectID){
    let current = getProject(projectID);
    if(typeof current.cluster == 'number'){
        current.cluster = clusters.getCluster(current.cluster);
    }
    return current;
}

function getProjectAll(){
    return common.formatJsonToArray(projects);
}

function createProject(name, alias, cluster, repo) {
    const repoInUse = Object.values(projects).some((project) => project.repo === repo);

    if (repoInUse) {
        common.error(`Erreur : Le chemin ${repo} est déjà utilisé par un autre project`, 'project');
        return null;
    }

    var clusterID = clusters.getCluster(cluster);
    if (clusterID == null) {
        common.error(`Erreur : Le cluster ${cluster} n'existe pas`, 'project');
        return null;
    }

    const id = Object.keys(projects).length;
    const newproject = {
        name,
        id,
        alias,
        cluster: clusterID.id,
        repo,
        path: common.getUrlLastPath(repo),
        ci: [],
        dockerID: common.generateRandomString(common.global.docker.IDgenerator),
    };
    projects[id] = newproject;
    saveProject();
    var base = getProjectDirs(id);
    common.mkdir(base.ci);
    common.mkdir(base.logs);
    clone.clone(repo, base.repo);
    return newproject;
}

function removeProject(id) {
    const project = Object.values(projects).find((project) => project.id === id);

    if (!project) {
        common.error(`Erreur : Aucun project avec l'ID ${id} n'a été trouvé`, 'project');
        return null;
    }

    var clusterID = clusters.getCluster(project.cluster);

    common.rmdir(`${clusterID.path}/${project.path}`);

    delete projects[project.id];
    common.sucess(`Project "${project.name}" supprimé`, 'project');
    saveProject();
    return project;
}

function setCIScript(id, ciScript){
    const project = Object.values(projects).find((project) => project.id === id);

    if (!project) {
        common.error(`Erreur : Aucun project avec l'ID ${id} n'a été trouvé`, 'project');
        return null;
    }
    
    projects[project.id].ci = ciScript;

    common.sucess(`Project "${project.name}" supprimé`, 'project');
    saveProject();
    return project;
}

function saveProject() {
    fs.writeFileSync(projectPath, JSON.stringify(projects, null, 2));
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