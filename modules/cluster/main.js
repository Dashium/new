const common = require('../common');
const fs = require('fs');
const path = require('path');

const clusterPath = path.join(__dirname, '../../config/cluster.json');
var clusters = require(clusterPath);

fs.watch(clusterPath, () => {
    try {
        const data = fs.readFileSync(clusterPath);
        clusters = JSON.parse(data);
        common.log(`Cluster chargé`, 'cluster');
    } catch (err) {
        common.error(`Erreur lors du chargement du cluster : ${err}`, 'cluster');
    }
});

function getClusterByID(ClusterID) {
    for (const key in clusters) {
        if (clusters[key].id === ClusterID) {
            return clusters[key];
        }
    }
    return null;
}

function getClusterByName(ClusterName) {
    for (const key in clusters) {
        if (clusters[key].name === ClusterName) {
            return clusters[key];
        }
    }
    return null;
}

function getCluster(clusterIDorName) {
    if (typeof clusterIDorName === 'number') {
        return getClusterByID(clusterIDorName);
    } else if (typeof clusterIDorName === 'string') {
        return getClusterByName(clusterIDorName);
    } else {
        common.error(`Type de paramètre invalide pour getCluster : ${typeof clusterParam}`, 'cluster');
    }
}

function getAllCluster(){
    return common.formatJsonToArray(clusters);
}

function createCluster(name, alias, path) {
    const pathInUse = Object.values(clusters).some((cluster) => cluster.path === path);

    if (pathInUse) {
        common.error(`Erreur : Le chemin ${path} est déjà utilisé par un autre cluster`, 'cluster');
        return null;
    }

    const id = Object.keys(clusters).length;
    const newCluster = {
        name,
        id,
        alias,
        path
    };
    clusters[id] = newCluster;
    
    common.mkdir(`${path}/`);

    common.sucess(`Cluster "${name}" crée`, 'cluster');
    saveCluster();
    return newCluster;
}

function removeCluster(id) {
    const cluster = Object.values(clusters).find((cluster) => cluster.id === id);

    if (!cluster) {
        common.error(`Erreur : Aucun cluster avec l'ID ${id} n'a été trouvé`, 'cluster');
        return null;
    }

    common.rmdir(cluster.path);

    delete clusters[cluster.id];
    common.sucess(`Cluster "${cluster.name}" supprimé`, 'cluster');
    saveCluster();
    return cluster;
}

function saveCluster() {
    fs.writeFileSync(clusterPath, JSON.stringify(clusters, null, 2));
}

module.exports = {
    getCluster,
    getAllCluster,
    getClusterByID,
    getClusterByName,
    createCluster,
    removeCluster
}