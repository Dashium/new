const { exec } = require('child_process');
const fs = require('fs');

function runDockerCommand(command, options, logFile = './logs/logs.txt', client) {
    if(logFile == null){
        logFile = './logs/logs.txt';
    }
    return new Promise((resolve, reject) => {
        const commandProcess = exec(`docker ${command}`, options);

        let logs = '';

        commandProcess.stdout.on('data', (data) => {
            logs += data;
            process.stdout.write(data);
            if(client != null){
                client.emit('output', data);
            }
            if (logFile !== '') {
                fs.appendFileSync(logFile, data);
            }
        });

        commandProcess.stderr.on('data', (data) => {
            logs += data;
            process.stderr.write(data);
            if(client != null){
                client.emit('output', data);
            }
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
        // await runDockerCommand(` docker update --restart unless-stopped ${containerName}`);
    }
}

async function startDockerContainer(containerName) {
    await runDockerCommand(`start ${containerName}`);
}

async function runCommandInContainer(containerName, command, logpath, client) {
    await runDockerCommand(`exec ${containerName} sh -c "${command}"`, null, logpath, client);
}

async function removeDockerContainer(containerName) {
    try {
        await runDockerCommand(`rm ${containerName}`);
        console.log(`Docker container '${containerName}' has been removed.`);
    } catch (error) {
        console.error(`Failed to remove Docker container '${containerName}'. Error: ${error.message}`);
    }
}

function monitorDocker(containerName) {
    var format = "{{.Name}}: CPU {{.CPUPerc}}, MEM {{.MemUsage}}, NET I/O {{.NetIO}}";
    // var format = `{"cpuUsage": {{.CPUPerc}},"memoryUsage": {{.MemUsage}},"networkIn": {{.NetIO}}}`;
    const cmd = `docker stats ${containerName} --format "${format}"`

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

async function getDockerNameByID(id){
    var name = await runDockerCommand(`ps -a --filter "id=${id}" --format "{{.Names}}"`);
    return name;
}

// async function main() {
//     const repoUrl = 'https://github.com/Dashium/demo_project';
//     const repoDir = 'new';
//     const imageName = 'ubuntu:latest';
//     const containerName = 'test8';
//     const portBinder = "3000:3000";

//     // await downloadGithubRepo(repoUrl, repoDir);
//     await downloadDockerImage(imageName);
//     await createDockerContainer(containerName, 3000, 3000, 38, imageName, repoDir);
//     await startDockerContainer(containerName);
//     await use('ubuntu', containerName);
//     await use('nodejs', containerName);
//     // await bindPorts(containerName, 3000, 3000);
//     await runCommandInContainer(containerName, 'npm install');
//     await runCommandInContainer(containerName, 'npm run test');

//     monitorDocker(containerName);
// }

// main().catch(error => console.error(error));

module.exports = {
    downloadDockerImage,
    createDockerContainer,
    startDockerContainer,
    use,
    runCommandInContainer,
    monitorDocker,
    removeDockerContainer,
    bindPorts,
    getDockerNameByID
}