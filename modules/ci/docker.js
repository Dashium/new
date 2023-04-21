const common = require('../common');
const { exec } = require('child_process');
const fs = require('fs');

async function addENV(env, value) {
    return `-e ${env}="${value}" `;
}

async function addENVS(envs) {
    let tmp = '';
    for (const element of envs) {
        let curr = element.split(':');
        tmp += await addENV(curr[0], curr[1]);
    }
    tmp = tmp.slice(0, -1);
    return tmp;
}

async function bindPort(host, container) {
    return `-p ${host}:${container} `;
}

async function bindPorts(list) {
    let tmp = '';
    for (const element of list) {
        tmp += await bindPort(element['host'], element['container']);
    }
    tmp = tmp.slice(0, -1);
    return tmp;
}

async function createDockerContainer(containerName, portBinder, envs, imageName, repoDir) {
    const containersList = await runDockerCommand('ps -a');
    if (!containersList.includes(containerName)) {
        var cmd = `create --name ${containerName} -it -v ${process.cwd()}/${repoDir}:/app`;
        if(portBinder != null){
            cmd += ` ${portBinder}`;
        }
        if(envs != null){
            cmd += ` ${envs}`;
        }
        await runDockerCommand(`${cmd} -w /app ${imageName} bash`, { cwd: repoDir });
    }
}

async function deleteContainer(containerName) {
    try {
        // Stop and remove the container
        await runDockerCommand(`stop ${containerName}`);
        await runDockerCommand(`rm ${containerName}`);

        console.log(`Container ${containerName} have been deleted.`);
    } catch (error) {
        console.error(error);
    }
}

async function deleteImage(imageName) {
    try {
        // Remove the image
        await runDockerCommand(`rmi ${imageName}`);
        console.log(`Image ${imageName} have been deleted.`);
    } catch (error) {
        console.error(error);
    }
}

async function downloadDockerImage(imageName) {
    const imagesList = await runDockerCommand('image ls');
    if (!imagesList.includes(imageName)) {
        await runDockerCommand(`pull ${imageName}`);
    }
}

async function getDockerNameByID(id) {
    var name = await runDockerCommand(`ps -a --filter "id=${id}" --format "{{.Names}}"`);
    return name;
}

async function getAllDockerName() {
    var name = await runDockerCommand(`ps -a --format "{{.Names}}"`);
    return name;
}

async function isContainerExist(containerName) {
    try {
        const output = await runDockerCommand(`ps -a --filter "name=${containerName}" --format "{{.Names}}"`);
        return output.trim() === containerName;
    } catch (error) {
        common.error(`Error while checking if container ${containerName} exists: ${error.message}`, 'docker');
        return false;
    }
}

function monitorDocker(containerName, client, socketId) {
    return new Promise((resolve, reject) => {
        var format = `{'cpuUsage': '{{.CPUPerc}}','memoryUsage': '{{.MemUsage}}','networkIn': '{{.NetIO}}'}`;
        const cmd = `docker stats ${containerName} --format "${format}"`;
        const process = exec(cmd);

        let logs = '';

        process.stdout.on('data', (data) => {
            logs += data;
            if (client != null) {
                client.to(socketId).emit('data', common.replaceAll(data, "'", '"'));
            }
        });

        process.stderr.on('data', (data) => {
            common.error(`Error: ${data}`, 'monitor');
            if (client != null) {
                client.to(socketId).emit('data', common.replaceAll("{'cpuUsage':'OFF', 'memoryUsage':'OFF', 'networkIn':'OFF / OFF'}", "'", '"'))
            }
            resolve(data);
        });

        process.on('close', (code) => {
            common.error(`Child process exited with code ${code}`, 'monitor');
            resolve(logs.trim());
        });
    });
}

function runDockerCommand(command, options, logFile, client) {
    if (logFile == null) {
        logFile = './logs/logs.txt';
    }
    return new Promise((resolve, reject) => {
        const commandProcess = exec(`docker ${command}`, options);

        let logs = '';
        let lastLogTime = Date.now();

        commandProcess.stdout.on('data', (data) => {
            logs += data;
            process.stdout.write(data);
            if (typeof client == 'function') {
                client(data);
            }
            if (logFile !== '') {
                fs.appendFileSync(logFile, data);
            }
            lastLogTime = Date.now();
        });

        commandProcess.stderr.on('data', (data) => {
            logs += data;
            process.stderr.write(data);
            if (typeof client == 'function') {
                client(data);
            }
            if (logFile !== '') {
                fs.appendFileSync(logFile, data);
            }
            lastLogTime = Date.now();
        });

        const checkLogsInterval = setInterval(() => {
            if (Date.now() - lastLogTime > 60000) { // 1 minute
                clearInterval(checkLogsInterval);
                commandProcess.kill();
                reject(new Error('Process stopped due to inactivity'));
            }
        }, 1000);

        commandProcess.on('close', (code) => {
            clearInterval(checkLogsInterval);
            if (code === 0) {
                if (typeof client == 'function') {
                    client('dashiumDONE');
                }
                resolve(logs.trim());
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

async function runCommandInContainer(containerName, command, logpath, client) {
    if (logpath != null) {
        fs.appendFileSync(logpath, `\n$ ${command} \n\n`);
    }
    await runDockerCommand(`exec ${containerName} sh -c "${command}"`, null, logpath, client);
}

async function startDockerContainer(containerName) {
    await runDockerCommand(`start ${containerName}`);
}

async function use(lang, containerName, logpath) {
    switch (lang) {
        case 'dashium':
            await runCommandInContainer(containerName, "apt-get update && apt-get install -y curl wget sudo nano", logpath);
            await runCommandInContainer(containerName, "apt-get install -y git", logpath);
            break;
        case 'nodejs':
            await runCommandInContainer(containerName, "apt-get update && apt-get install -y curl wget", logpath);
            await runCommandInContainer(containerName, 'curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -', logpath);
            await runCommandInContainer(containerName, 'sudo apt install nodejs -y', logpath);
            break;
        case 'minecraft_server':
            await runCommandInContainer(containerName, 'sudo apt install openjdk-17-jre-headless -y', logpath);
            await runCommandInContainer(containerName, 'sudo apt install ufw -y', logpath);
            await runCommandInContainer(containerName, 'sudo ufw allow 25565', logpath);
            await runCommandInContainer(containerName, 'mkdir minecraft_server', logpath);
            await runCommandInContainer(containerName, 'cd minecraft_server && wget https://piston-data.mojang.com/v1/objects/8f3112a1049751cc472ec13e397eade5336ca7ae/server.jar', logpath);
            await runCommandInContainer(containerName, 'cd minecraft_server && sudo java -Xms1G -Xmx2G -jar server.jar nogui', logpath);
            await runCommandInContainer(containerName, "cd minecraft_server && sudo sed -i 's/false/true/g' eula.txt", logpath);
            await runCommandInContainer(containerName, 'cd minecraft_server && sudo java -Xms1G -Xmx2G -jar server.jar nogui', logpath);
            break;
        default:
            console.log('none');
    }
}

module.exports = {
    addENVS,
    bindPorts,
    createDockerContainer,
    deleteContainer,
    deleteImage,
    downloadDockerImage,
    getAllDockerName,
    getDockerNameByID,
    isContainerExist,
    monitorDocker,
    runCommandInContainer,
    startDockerContainer,
    use
}