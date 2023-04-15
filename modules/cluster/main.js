const common = require('../common');
const dbModule = require('../bdd/main');

function getClusterByID(ClusterID) {
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        const [entry] = await dbModule.selectRows(db, 'clusters', '*', 'id = ?', [ClusterID]);
        resolve(entry);
    });
}

function getClusterByName(ClusterName) {
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        const [entry] = await dbModule.selectRows(db, 'projects', '*', 'name = ?', [ClusterName]);
        resolve(entry);
    });
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
    return new Promise(async (resolve, reject) => {
        const db = await dbModule.loadDatabase('dashium');
        const entries = await dbModule.selectRows(db, 'clusters');
        resolve(entries);
    });
}

async function createCluster(name, alias, path) {
    var db = await dbModule.loadDatabase('dashium');
    const pathInUse = await dbModule.selectRows(db, 'clusters', '*', 'path = ?', [path]);

    if (pathInUse.length > 0) {
        common.error(`Erreur : Le chemin ${path} est déjà utilisé par un autre cluster`, 'cluster');
        return null;
    }

    const newCluster = {
        name,
        alias,
        path
    };
    
    common.mkdir(`${path}/`);

    common.sucess(`Cluster "${name}" crée`, 'cluster');
    
    await dbModule.insertRow(db, 'clusters', {
        'name': newCluster.name,
        'alias': newCluster.alias,
        'path': newCluster.path,
    });
    return newCluster;
}

async function removeCluster(id) {
    var db = await dbModule.loadDatabase('dashium');
    const cluster = await dbModule.selectRows(db, 'clusters', '*', 'id = ?', [id]);

    if (cluster == null) {
        common.error(`Erreur : Il n'y a aucun cluster dans la BDD`, 'cluster');
        return null;
    }
    if (cluster.length == 0) {
        common.error(`Erreur : Aucun cluster avec l'ID ${id} n'a été trouvé`, 'cluster');
        return null;
    }

    const projects = await dbModule.selectRows(db, 'projects', '*', 'cluster = ?', [id]);
    if(projects.length > 0){
        common.error('this cluster has been used !', 'cluster');
        return;
    }

    common.rmdir(cluster[0].path);

    await dbModule.deleteRows(db, 'clusters', 'id = ?', [id]);

    common.sucess(`Cluster "${cluster[0].name}" supprimé`, 'cluster');

    return cluster;
}

module.exports = {
    createCluster,
    getAllCluster,
    getCluster,
    getClusterByID,
    getClusterByName,
    removeCluster
}