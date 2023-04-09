const { exec } = require('child_process');
const fs = require('fs');
const clone = require('./modules/clone/main');

function runDockerCommand(command, options, logFile = './logs.txt') {
    return new Promise((resolve, reject) => {
        const commandProcess = exec(`docker ${command}`, options);

        let logs = '';

        commandProcess.stdout.on('data', (data) => {
            logs += data;
            process.stdout.write(data);
            if (logFile !== '') {
                fs.appendFileSync(logFile, data);
            }
        });

        commandProcess.stderr.on('data', (data) => {
            logs += data;
            process.stderr.write(data);
            if (logFile !== '') {
                fs.appendFileSync(logFile, data);
            }
        });

        commandProcess.on('close', (code) => {
            if (code === 0) {
                resolve(logs.trim());
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

async function downloadDockerImage(imageName) {
    const imagesList = await runDockerCommand('image ls');
    if (!imagesList.includes(imageName)) {
        await runDockerCommand(`pull ${imageName}`);
    }
}

async function createDockerContainer(containerName, portBinder, imageName, repoDir) {
    const containersList = await runDockerCommand('ps -a');
    if (!containersList.includes(containerName)) {
        await runDockerCommand(`create --name ${containerName} -it -v ${process.cwd()}/${repoDir}:/app ${portBinder} -w /app ${imageName} bash`, { cwd: repoDir });
        await runDockerCommand(` docker update --restart unless-stopped ${containerName}`);
    }
}

async function startDockerContainer(containerName) {
    await runDockerCommand(`start ${containerName}`);
}

async function runCommandInContainer(containerName, command) {
    await runDockerCommand(`exec ${containerName} sh -c "${command}"`);
}

function monitorDocker(containerName) {
    const cmd = `docker stats ${containerName} --format "{{.Name}}: CPU {{.CPUPerc}}, MEM {{.MemUsage}}, NET I/O {{.NetIO}}"`

    const process = exec(cmd);

    process.stdout.on('data', (data) => {
        console.log(data);
    });

    process.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
}

async function bindPort(host, container){
    return `-p ${host}:${container} `;
}

async function bindPorts(list){
    let tmp = '';
    for (const element of list) {
        tmp += await bindPort(element['host'], element['container']);
    }
    tmp = tmp.slice(0, -1);
    return tmp;
}

async function use(lang, containerName) {
    switch (lang) {
        case 'dashium':
            await runCommandInContainer(containerName, "apt-get update && apt-get install -y curl wget sudo nano");
            await runCommandInContainer(containerName, "apt-get install -y git");
            break;
        case 'nodejs':
            await runCommandInContainer(containerName, "apt-get update && apt-get install -y curl wget");
            await runCommandInContainer(containerName, 'curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -');
            await runCommandInContainer(containerName, 'sudo apt install nodejs -y');
            break;
        case 'minecraft_server':
            await runCommandInContainer(containerName, 'sudo apt install openjdk-17-jre-headless -y');
            await runCommandInContainer(containerName, 'sudo apt install ufw -y');
            await runCommandInContainer(containerName, 'sudo ufw allow 25565');
            await runCommandInContainer(containerName, 'mkdir minecraft_server');
            await runCommandInContainer(containerName, 'cd minecraft_server && wget https://piston-data.mojang.com/v1/objects/8f3112a1049751cc472ec13e397eade5336ca7ae/server.jar');
            await runCommandInContainer(containerName, 'cd minecraft_server && sudo java -Xms1G -Xmx2G -jar server.jar nogui');
            await runCommandInContainer(containerName, "cd minecraft_server && sudo sed -i 's/false/true/g' eula.txt");
            await runCommandInContainer(containerName, 'cd minecraft_server && sudo java -Xms1G -Xmx2G -jar server.jar nogui');
            break;
        default:
            console.log('none');
    }
}

async function main() {
    const repoUrl = 'https://github.com/Dashium/demo_project';
    const repoDir = 'new';
    const imageName = 'ubuntu:latest';
    const containerName = 'test9';

    const ports = await bindPorts([
        {host: 3001, container: 3000},
        {host: 50, container: 50},
        {host: 300, container: 22},
    ]);

    // await clone.clone(repoUrl, repoDir);
    await downloadDockerImage(imageName);
    await createDockerContainer(containerName, ports, imageName, repoDir);
    await startDockerContainer(containerName);
    await use('dashium', containerName);
    await use('nodejs', containerName);
    await runCommandInContainer(containerName, 'npm install');
    await runCommandInContainer(containerName, 'npm run test');

    monitorDocker(containerName);
}

main().catch(error => console.error(error));