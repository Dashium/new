const { exec } = require('child_process');
const fs = require('fs');

function runDockerCommand(command, options, logFile, client) {
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

async function isContainerExist(containerName) {
    try {
        const output = await runDockerCommand(`ps -a --filter "name=${containerName}" --format "{{.Names}}"`);
        return output.trim() === containerName;
    } catch (error) {
        common.error(`Error while checking if container ${containerName} exists: ${error.message}`);
        return false;
    }
}

async function downloadDockerImage(imageName) {
    const imagesList = await runDockerCommand('image ls');
    if (!imagesList.includes(imageName)) {
        await runDockerCommand(`pull ${imageName}`);
    }
}

async function createDockerContainer(containerName, portBinder, envs, imageName, repoDir) {
    const containersList = await runDockerCommand('ps -a');
    if (!containersList.includes(containerName)) {
        console.log(`create --name ${containerName} -it -v ${process.cwd()}/${repoDir}:/app ${portBinder} ${envs} -w /app ${imageName} bash`);
        await runDockerCommand(`create --name ${containerName} -it -v ${process.cwd()}/${repoDir}:/app ${portBinder} ${envs} -w /app ${imageName} bash`, { cwd: repoDir });
        // await runDockerCommand(` docker update --restart unless-stopped ${containerName}`);
    }
}

async function startDockerContainer(containerName) {
    await runDockerCommand(`start ${containerName}`);
}

async function runCommandInContainer(containerName, command, logpath, client) {
    if (logpath != null) {
        fs.appendFileSync(logpath, `\n$ ${command} \n\n`);
    }
    await runDockerCommand(`exec ${containerName} sh -c "${command}"`, null, logpath, client);
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

async function addENV(env, value){
    return `-e ${env}="${value}" `;
}

async function addENVS(envs){
    let tmp = '';
    for (const element of envs) {
        let curr = element.split(':');
        tmp += await addENV(curr[0], curr[1]);
    }
    tmp = tmp.slice(0, -1);
    return tmp;
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

async function getDockerNameByID(id){
    var name = await runDockerCommand(`ps -a --filter "id=${id}" --format "{{.Names}}"`);
    return name;
}

module.exports = {
    addENVS,
    downloadDockerImage,
    createDockerContainer,
    startDockerContainer,
    use,
    runCommandInContainer,
    monitorDocker,
    bindPorts,
    getDockerNameByID,
    deleteContainer,
    deleteImage,
    isContainerExist
}