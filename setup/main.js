const common = require('../modules/common');
const cluster = require('../modules/cluster/main');
const projet = require('../modules/projets/main');
const ci = require('../modules/ci/main');

common.mkdir('logs');

// CREATE DEFAULT CLUSTER
cluster.createCluster('Local Cluster #1', 'default', './clusters/cluster');

// CREATE DEFAULT PROJET
var projectData = projet.createProject('Demo Dashium', 'default', 'Local Cluster #1', 'https://github.com/Dashium/demo_project');
projet.setCIScript(projectData.id, [
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

// ci.runCI(projectData.id);

setTimeout(() => {
    common.log('installation finish !', 'setup');
    common.log('please run: `npm start`', 'setup');
    setTimeout(() => {
        process.exit(0);
    }, 100);
}, 500);


// async function runSetup() {
//     // Créer le dossier logs
//     await common.mkdir('logs');

//     // Créer le cluster par défaut
//     await cluster.createCluster('Local Cluster #1', 'default', './clusters/cluster');

//     // Créer le projet par défaut
//     var projectData = await projet.createProject('Demo Dashium', 'default', 'Local Cluster #1', 'https://github.com/Dashium/demo_project');
//     await projet.setCIScript(projectData.id, [
//         {
//             "name": "Node installer",
//             "mode": "npm",
//             "run": "npm install"
//         },
//         {
//             "name": "Node run",
//             "mode": "npm",
//             "run": "npm test"
//         }
//     ]);

//     // Exécuter le script CI
//     await ci.runCI(projectData.id)
//         .then(() => {
//             common.log('Installation finish !', 'setup');
//             common.log('Please run: `npm start`', 'setup');
//             // Attendre 100ms avant de terminer le processus
//             setTimeout(() => {
//                 process.exit(0);
//             }, 100);
//         })
//         .catch((error) => {
//             common.error(`Error during CI script execution: ${error}`, 'setup');
//             // Terminer le processus avec une erreur
//             process.exit(1);
//         });
// }
// runSetup();