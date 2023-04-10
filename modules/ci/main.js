const fs = require('fs');
const common = require('../common');
const project = require('../projets/main');
const npm = require('./npm');

const clone = require('../clone/main');
const docker = require('./docker');

const { exec } = require('child_process');

async function getCIScript(id) {
    var current = await project.getProject(id);
    current.ci = JSON.parse(current.ci);
    common.log(`get ci #${id} project`, 'ci');
    return current.ci;
}

function runTasks(tasks, cipath, logpath) {
    tasks.reduce((previousPromise, task) => {
        return previousPromise.then(() => {
            common.log(`Starting task "${task.name}"...`, 'ci');
            return new Promise((resolve, reject) => {
                switch (task.mode) {
                    case 'npm':
                        exec(task.run, { cwd: cipath }, (error, stdout, stderr) => {
                            if (error) {
                                common.error(`Error running task "${task.name}": ${error}`, 'ci');
                                reject(error);
                            } else {
                                common.sucess(`Task "${task.name}" finished successfully.`, 'ci');
                                resolve();
                            }
                            fs.writeFile(`${logpath}/logs.txt`, stdout, (err) => {
                                if (err) throw err;
                            });
                        });
                        break;
                    default:
                        common.error('No task mode detected!', 'ci');
                        reject(new Error('No task mode detected!'));
                }
            });
        });
    }, Promise.resolve())
        .then(() => {
            common.sucess('All tasks finished successfully!', 'ci');
        })
        .catch((err) => {
            common.error(`Error running tasks:${err}`, 'ci');
        });
}

async function runCI(id) {
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
        {host: 3001, container: 3000},
        {host: 50, container: 50},
        {host: 300, container: 22},
    ]);

    const containerName = currentProject.dockerID;

    await docker.createDockerContainer(containerName, ports, 'ubuntu:latest', current.ci);
    await docker.startDockerContainer(containerName);
    await docker.use('dashium', containerName);
    await docker.use('nodejs', containerName);
    await docker.runCommandInContainer(containerName, 'npm install');

    // runTasks(ciScript, current.ci, current.logs);
}

module.exports = {
    getCIScript,
    runCI
}