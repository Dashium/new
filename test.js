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

async function createDockerContainer(containerName, hostPort, containerPort, sshPort, imageName, repoDir) {
    if(hostPort == null){
        hostPort = 3000;
    }
    if(containerPort == null){
        containerPort = 3000;
    }
    const containersList = await runDockerCommand('ps -a');
    if (!containersList.includes(containerName)) {
        await runDockerCommand(`create --name ${containerName} -it -v ${process.cwd()}/new:/app -p ${hostPort}:${containerPort} -p ${sshPort}:22 -w /app ${imageName} bash`, { cwd: repoDir });
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

async function use(lang, containerName) {
    switch (lang) {
        case 'ubuntu':
            await runCommandInContainer(containerName, "apt-get update && apt-get install -y curl wget sudo");
            await runCommandInContainer(containerName, "apt-get install -y openssh-server");
            break;
        case 'nodejs':
            await runCommandInContainer(containerName, "apt-get update && apt-get install -y curl wget");
            await runCommandInContainer(containerName, 'curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -');
            await runCommandInContainer(containerName, 'sudo apt install nodejs -y');
            // await runCommandInContainer(containerName, 'sudo apt install npm -y');
            break;
        default:
            console.log('none');
    }
}

async function main() {
    const repoUrl = 'https://github.com/Dashium/demo_project';
    const repoDir = 'new';
    const imageName = 'ubuntu:latest';
    const containerName = 'test8';
    const portBinder = "3000:3000";

    await clone.clone(repoUrl, repoDir);
    await downloadDockerImage(imageName);
    await createDockerContainer(containerName, 3001, 3000, 38, imageName, repoDir);
    await startDockerContainer(containerName);
    await use('ubuntu', containerName);
    await use('nodejs', containerName);
    // await bindPorts(containerName, 3000, 3000);
    await runCommandInContainer(containerName, 'npm install');
    await runCommandInContainer(containerName, 'npm run test');

    monitorDocker(containerName);
}

main().catch(error => console.error(error));