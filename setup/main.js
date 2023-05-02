/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
const dbModule = require('../modules/bdd/main');
const readline = require('readline');
const fs = require('fs');
const common = require('../modules/common');
const github = require('../modules/clone/github');

async function init(stopanimation, data) {
    const common = require('../modules/common');
    const cluster = require('../modules/cluster/main');
    const projet = require('../modules/projets/main');
    const account = require('../modules/account/main');
    const ci = require('../modules/ci/main');

    common.mkdir('config');
    common.mkdir('logs');

    try {
        // START CREATE BDD
        const db = await dbModule.createDatabase('dashium');
        await dbModule.createTable(db, 'users',
            [
                'id INTEGER PRIMARY KEY',
                'email TEXT',
                'name TEXT',
                'password TEXT',
                'type TEXT'
            ]
        );
        await dbModule.createTable(db, 'integrations',
            [
                'id INTEGER PRIMARY KEY',
                'service TEXT',
                'appID TEXT',
                'key TEXT'
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
                'alias TEXT',
                'path TEXT',
                'name TEXT'
            ]
        );
        await dbModule.createTable(db, 'projects',
            [
                'id INTEGER PRIMARY KEY',
                'alias TEXT',
                'ci TEXT',
                'cluster INTEGER',
                'date TEXT',
                'deploy TEXT',
                'docker TEXT',
                'lastupdate TEXT',
                'name TEXT',
                'owner TEXT',
                'path TEXT',
                'repo TEXT'
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
            },
            "update": {
                "sha": await github.getLatestCommitSha('./')
            }
        };
        await dbModule.insertRow(db, 'global', {
            json: JSON.stringify(globalDATA)
        });

        await account.registerUser({ email: data.adminEmail, password: data.adminPassWord, name: data.adminName, type: 'admin' });

        common.global = globalDATA;
        await fs.writeFileSync('./config/global.json', JSON.stringify(globalDATA, null, 2));

        await setTimeout(async () => {
            console.log('Save !');

            // CREATE DEFAULT CLUSTER
            await cluster.createCluster('Local Cluster #1', 'default', './clusters/cluster');

            // CREATE DEFAULT PROJET
            var { alias } = await projet.createProject('Demo Dashium', 1, 'https://github.com/Dashium/demo_project', 'root');
            var current = await projet.getProject(alias);
            await projet.addCIcmd(current.id, "Node installer", "npm install");
            await projet.addCIcmd(current.id, "Node run", "npm test");
            await projet.setDockerImage(current.id, 'ubuntu:latest');
            await projet.addDockerUse(current.id, 'dashium');
            await projet.addDockerUse(current.id, 'nodejs');
            await projet.addDockerPort(current.id, 3000);
            await projet.addDockerEnv(current.id, 'dashiumENV:my env');

            await ci.runCI(current.id);

            await stopanimation();

            common.log('installation finish !', 'setup');
            common.log('please run: `npm start`', 'setup');
            process.exit(0);

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

    const adminEmail = await askQuestion("What is the admin email? (default: root@local) ", 'root@local');
    console.log(`Hi, my admin email is ${adminEmail} !`);

    const adminName = await askQuestion("What is the admin name? (default: Root) ", 'Root');
    console.log(`Hi, my admin name is ${adminName} !`);

    const adminPassword = await askQuestion("What is the admin password? (default: dashium) ", 'dashium');
    console.log(`Hi, my admin password is ${adminPassword} !`);

    const host = await askQuestion(`What is the host name or IP address of the server? (default: ${common.getHostname()}.local) `, `${common.getHostname()}.local`);
    console.log(`The host name or IP address of the server is ${host.toLowerCase()}.`);

    const port = await askQuestion("What is the port number of the server? (default: 443) ", 443);
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

    const autoStart = await askQuestion("Do you want to enable automatic start? (Y/n) (default: Y) ", 'Y');
    console.log(`Automatic start: ${autoStart}.`);

    init(loadingAnimation(), {
        name: name,
        adminEmail: adminEmail,
        adminName: adminName,
        adminPassWord: adminPassword,
        host: host.toLowerCase(),
        port: parseInt(port),
        APIport: parseInt(APIport),
        sshPort: parseInt(sshPort),
        socketPort: parseInt(socketPort),
        monitorPort: parseInt(monitorPort),
        dockerGEN: dockerGEN,
        dockerPortStart: parseInt(dockerPortStart),
        dockerPortEnd: parseInt(dockerPortEnd),
        dockerIMG: dockerIMG,
        aliasGEN: aliasGEN,
        autoStart: autoStart,
    });
}

setTimeout(() => {
    main();
}, 1000);
