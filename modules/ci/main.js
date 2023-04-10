const fs = require('fs');
const common = require('../common');
const project = require('../projets/main');

const clone = require('../clone/main');
const docker = require('./docker');

async function getCIScript(id) {
    var current = await project.getProject(id);
    current.ci = JSON.parse(current.ci);
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

async function runCI(id) {
    const currentDate = common.replaceAll(new Date().toISOString(), ':', '-');
    var current = await project.getProjectDirs(id);
    var currentProject = await project.getProject(id);

    if (fs.existsSync(current.ci)) {
        await common.rmdir(current.ci);
        await common.mkdir(current.ci);
    }

    await clone.clone(currentProject.repo, current.repo);

    await common.copyDir(current.repo, current.ci);

    var ciScript = await getCIScript(id);

    const ports = await docker.bindPorts([
        { host: 3001, container: 3000 },
        { host: 50, container: 50 },
        { host: 300, container: 22 },
    ]);

    const containerName = currentProject.dockerID;

    await docker.createDockerContainer(containerName, ports, 'ubuntu:latest', current.ci);
    await docker.startDockerContainer(containerName);
    await docker.use('dashium', containerName);
    await docker.use('nodejs', containerName);

    await runTasks(ciScript, containerName, `${current.logs}/${currentDate}.txt`);
}

module.exports = {
    getCIScript,
    runCI
}