const { exec } = require('child_process');
const path = require('path');

function runDockerCommand(command, options) {
    return new Promise((resolve, reject) => {
        exec(`docker ${command}`, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

async function buildDockerImage(tag, dockerfilePath, contextPath) {
    await runDockerCommand(`build -t ${tag} ${dockerfilePath}`, { cwd: contextPath });
}

async function dockerCreate(containerName, imageTag, localPath) {
    // récupérer le chemin absolu du répertoire local
    const absolutePath = path.resolve(localPath);

    // créer le conteneur
    const containerId = await runDockerCommand(`create --name ${containerName} ${imageTag} ${absolutePath}`);

    // retourner l'ID du conteneur créé
    return containerId;
}

async function runDockerContainer(containerName, image, options = '') {
    await runDockerCommand(`run --name ${containerName} ${options} ${image}`);
}

async function stopDockerContainer(containerName) {
    await runDockerCommand(`stop ${containerName}`);
}

async function removeDockerContainer(containerName) {
    await runDockerCommand(`rm ${containerName}`);
}

async function removeDockerImage(imageName) {
    await runDockerCommand(`rmi ${imageName}`);
}

async function listDockerContainers() {
    const output = await runDockerCommand('ps');
    return output.split('\n').slice(1).map(line => line.trim().split(/\s{2,}/));
}

async function listDockerImages() {
    const output = await runDockerCommand('images');
    return output.split('\n').slice(1).map(line => line.trim().split(/\s{2,}/));
}

async function pullDockerImage(imageName) {
    await runDockerCommand(`pull ${imageName}`);
}

async function pushDockerImage(imageName) {
    await runDockerCommand(`push ${imageName}`);
}

async function executeCommandInDockerContainer(containerName, command) {
    await runDockerCommand(`exec ${containerName} ${command}`);
}

async function getDockerContainerLogs(containerName) {
    return await runDockerCommand(`logs ${containerName}`);
}

async function inspectDockerContainer(containerName) {
    return await runDockerCommand(`inspect ${containerName}`);
}

async function inspectDockerImage(imageName) {
    return await runDockerCommand(`inspect ${imageName}`);
}

async function manageDockerNetwork(command, options) {
    await runDockerCommand(`network ${command} ${options}`);
}

async function runDockerComposeCommand(command, options) {
    await runDockerCommand(`compose ${command} ${options}`);
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

module.exports = {
    buildDockerImage,
    runDockerContainer,
    stopDockerContainer,
    removeDockerContainer,
    removeDockerImage,
    listDockerContainers,
    listDockerImages,
    pullDockerImage,
    pushDockerImage,
    executeCommandInDockerContainer,
    getDockerContainerLogs,
    inspectDockerContainer,
    inspectDockerImage,
    manageDockerNetwork,
    runDockerComposeCommand,
    monitorDocker,
    dockerCreate
}