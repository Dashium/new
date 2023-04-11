const common = require('../modules/common');
const cluster = require('../modules/cluster/main');
const projet = require('../modules/projets/main');
const ci = require('../modules/ci/main');
const dbModule = require('../modules/bdd/main');

common.mkdir('logs');

async function init() {
    try {
        // START CREATE BDD
        const db = await dbModule.createDatabase('dashium');
        await dbModule.createTable(db, 'users',
            [
                'id INTEGER PRIMARY KEY',
                'name TEXT',
                'age INTEGER'
            ]
        );
        await dbModule.createTable(db, 'global',
            [
                'id INTEGER PRIMARY KEY',
                'name TEXT',
                'age INTEGER'
            ]
        );
        await dbModule.createTable(db, 'clusters',
            [
                'id INTEGER PRIMARY KEY',
                'name TEXT',
                'alias TEXT',
                'path TEXT'
            ]
        );
        await dbModule.createTable(db, 'projects',
            [
                'id INTEGER PRIMARY KEY',
                'name TEXT',
                'alias TEXT',
                'cluster INTEGER',
                'repo TEXT',
                'path TEXT',
                'ci TEXT',
                'docker TEXT'
            ]
        );
        // END CREATE BDD

        // CREATE DEFAULT CLUSTER
        await cluster.createCluster('Local Cluster #1', 'default', './clusters/cluster');

        // CREATE DEFAULT PROJET
        var {alias} = await projet.createProject('Demo Dashium', 1, 'https://github.com/Dashium/demo_project');
        var current = await projet.getProject(alias);
        await projet.setCIScript(current.id, [
            {
                "name": "Node installer",
                "mode": "npm",
                "run": "npm install"
            },
            {
                "name": "Node run",
                "mode": "npm",
                "run": "npm test"
            }
        ]);
        await projet.setDockerImage(current.id, 'ubuntu:latest');
        await projet.addDockerUse(current.id, 'dashium');
        await projet.addDockerUse(current.id, 'nodejs');

        await ci.runCI(current.id);

        common.log('installation finish !', 'setup');
        common.log('please run: `npm start`', 'setup');

    } catch (error) {
        console.error(error);
    }
}
init();