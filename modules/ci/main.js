const fs = require('fs');
const common = require('../common');
const project = require('../projets/main');

const clone = require('../clone/main');
const docker = require('./docker');

async function getCIScript(id) {
    var current = await project.getProject(id);
    common.log(`get ci #${id} project`, 'ci');
    return current.ci;
}

async function runTasks(tasks, containerName, logpath) {
    try {
        for (const task of tasks) {
            common.log(`Starting task "${task.name}"...`, 'ci');
            if (!task.mode) {
                common.error('No task mode detected!', 'ci');
                return;
            }
            await docker.runCommandInContainer(containerName, task.run, logpath);
            common.sucess(`Task "${task.name}" finished successfully.`, 'ci');
        }
        common.success('All tasks finished successfully!', 'ci');
    } catch (error) {
        common.error(`Error running tasks: ${error}`, 'ci');
    }
}

async function addUse(uses, containerName, logpath) {
    try {
        for (const use of uses) {
            common.log(`Import use "${use}"...`, 'ci');
            await docker.use(use, containerName, logpath);
            common.sucess(`Import use "${use}" finished successfully.`, 'ci');
        }
        common.success('All tasks finished successfully!', 'ci');
    } catch (error) {
        common.error(`Error running tasks: ${error}`, 'ci');
    }
}

async function runCI(id) {
    const currentDate = common.replaceAll(new Date().toISOString(), ':', '-');
    var current = await project.getProjectDirs(id);
    var currentProject = await project.getProject(id);
    const containerName = currentProject.docker.dockerID;

    const logpath = `${current.logs}/${currentDate}.txt`;

    if (fs.existsSync(current.repo)) {
        await common.rmdir(current.repo);
    }
    
    if(await docker.isContainerExist(containerName) == true){
        await docker.deleteContainer(containerName);
    }
    if (fs.existsSync(current.ci)) {
        await common.rmdir(current.ci);
        await common.mkdir(current.ci);
    }
    
    try {
        await clone.clone(currentProject.repo, current.repo);
    } catch (error) {
        common.error('Clone imposible !', 'ci');
    }

    await common.copyDir(current.repo, current.ci);

    var ciScript = await getCIScript(id);

    var containerHost = await project.getProjectPorts(id, 'container');
        containerHost = await project.Portfinder(3000, containerHost);

    if(typeof currentProject.docker.ports != 'object'){currentProject.docker.ports = [];}
    currentProject.docker.ports.push({host: common.global.socket.port, container: containerHost})

    const ports = await docker.bindPorts(currentProject.docker.ports);

    await docker.downloadDockerImage(currentProject.docker.image);
    await docker.createDockerContainer(containerName, ports, currentProject.docker.image, current.ci);
    await docker.startDockerContainer(containerName);

    await addUse(currentProject.docker.use, containerName, logpath);

    await runTasks(ciScript, containerName, logpath);
}

module.exports = {
    getCIScript,
    runCI
}