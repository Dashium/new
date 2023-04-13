const dbModule = require('../modules/bdd/main');
const readline = require('readline');
const fs = require('fs');

function replaceLocalhost(jsonObj, newHost) {
    for (const key in jsonObj) {
        if (typeof jsonObj[key] === 'object') {
            replaceLocalhost(jsonObj[key], newHost);
        } else if (typeof jsonObj[key] === 'string' && jsonObj[key].includes('replaceHERE')) {
            jsonObj[key] = jsonObj[key].replace(/replaceHERE/g, newHost);
        }
    }
    return jsonObj;
}

async function init(stopanimation, data) {
    const common = require('../modules/common');
    const cluster = require('../modules/cluster/main');
    const projet = require('../modules/projets/main');
    const ci = require('../modules/ci/main');

    common.mkdir('config');
    common.mkdir('logs');

    // if (common.global.api.host == "replaceHERE") {
    //     var tmp = fs.readFileSync('./config/global.json');
    //     tmp = JSON.parse(tmp);

    //     tmp = replaceLocalhost(tmp, `${common.getHostname()}.local`);

    //     fs.writeFileSync('./config/global.json', JSON.stringify(tmp, null, 2));
    // }

    try {
        // START CREATE BDD
        const db = await dbModule.createDatabase('dashium');
        await dbModule.createTable(db, 'users',
            [
                'id INTEGER PRIMARY KEY',
                'email TEXT',
                'password TEXT'
            ]
        );
        await dbModule.createTable(db, 'global',
            [
                'id INTEGER PRIMARY KEY',
                'json TEXT'
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

        // STORE GLOBAL CONFIG
        var globalDATA = {
            "server": {
                "name": data.name,
                "host": data.host,
                "port": data.port,
                "encrypt": common.generateRandomString(50)
            },
            "api": {
                "host": data.host,
                "port": data.APIport
            },
            "ssh": {
                "host": data.host,
                "port": data.sshPort
            },
            "socket": {
                "host": data.host,
                "port": data.socketPort
            },
            "monitor": {
                "host": data.host,
                "port": data.monitorPort
            },
            "docker": {
                "IDgenerator": data.dockerGEN,
                "ports": {
                    "start": data.dockerPortStart,
                    "end": data.dockerPortEnd
                }
            },
            "alias": {
                "generator": data.aliasGEN
            }
        };
        await dbModule.insertRow(db, 'global', {
            json: JSON.stringify(globalDATA)
        });

        common.global = globalDATA;
        await fs.writeFileSync('./config/global.json', JSON.stringify(globalDATA, null, 2));

        await setTimeout(async () => {
            console.log('Save !');

            // CREATE DEFAULT CLUSTER
            await cluster.createCluster('Local Cluster #1', 'default', './clusters/cluster');

            // CREATE DEFAULT PROJET
            var { alias } = await projet.createProject('Demo Dashium', 1, 'https://github.com/Dashium/demo_project');
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
            await projet.addDockerPort(current.id, 3000);

            await ci.runCI(current.id);

            await stopanimation();

            common.log('installation finish !', 'setup');
            common.log('please run: `npm start`', 'setup');

        }, 5000);
    } catch (error) {
        console.error(error);
    }
}

function loadingAnimation() {
    const frames = ['Loading ◜', 'Loading ◠', 'Loading ◝', 'Loading ◞', 'Loading ◡', 'Loading ◟'];
    let i = 0;
    const intervalId = setInterval(() => {
        process.stdout.write('\r' + frames[i] + '   ');
        i = (i + 1) % frames.length;
    }, 100);
    return () => {
        clearInterval(intervalId);
        process.stdout.write('\r');
    };
}

function askQuestion(query, df) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(query, res => {
        rl.close();
        if (res == '') { res = df; }
        resolve(res);
    }))
}

async function main() {
    console.log('\r');

    const name = await askQuestion("What is the name of the server? (default: Dashium) ", 'Dashium');
    console.log(`Hi, my name is ${name} !`);

    const host = await askQuestion("What is the host name or IP address of the server? (default: localhost) ", 'localhost');
    console.log(`The host name or IP address of the server is ${host}.`);

    const port = await askQuestion("What is the port number of the server? (default: 8080) ", 8080);
    console.log(`The port number of the server is ${port}.`);

    const APIport = await askQuestion("What is the port number of the API server? (default: 5051) ", 5051);
    console.log(`The port number of the API server is ${APIport}.`);

    const sshPort = await askQuestion("What is the port number of the SSH server? (default: 3200) ", 3200);
    console.log(`The port number of the SSH server is ${sshPort}.`);

    const socketPort = await askQuestion("What is the port number of the socket server? (default: 3400) ", 3400);
    console.log(`The port number of the socket server is ${socketPort}.`);

    const monitorPort = await askQuestion("What is the port number of the monitor server? (default: 3300) ", 3300);
    console.log(`The port number of the monitor server is ${monitorPort}.`);

    const dockerGEN = await askQuestion("What is the number of characters to generate for the docker IDs? (default: 10) ", 10);
    console.log(`${dockerGEN} characters ok.`);

    const dockerPortStart = await askQuestion("What is the starting port number for Docker? (default: 2000) ", 2000);
    console.log(`The starting port number for Docker is ${dockerPortStart}.`);

    const dockerPortEnd = await askQuestion("What is the ending port number for Docker? (default: 6000) ", 6000);
    console.log(`The ending port number for Docker is ${dockerPortEnd}.`);

    const dockerIMG = await askQuestion(`What is the default Docker image? (default: ubuntu:latest) `, 'ubuntu:latest');
    console.log(`The default Docker image is ${dockerIMG}.`);

    const aliasGEN = await askQuestion("What is the number of characters to generate for the alias? (default: 30) ", 30);
    console.log(`${aliasGEN} characters ok.`);

    init(loadingAnimation(), {
        name: name,
        host: host,
        port: port,
        APIport: APIport,
        sshPort: sshPort,
        socketPort: socketPort,
        monitorPort: monitorPort,
        dockerGEN: dockerGEN,
        dockerPortStart: dockerPortStart,
        dockerPortEnd: dockerPortEnd,
        dockerIMG: dockerIMG,
        aliasGEN: aliasGEN,
    });
}

setTimeout(() => {
    main();
}, 1000);
