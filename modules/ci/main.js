const fs = require('fs');
const common = require('../common');
const project = require('../projets/main');
const npm = require('./npm');

const docker = require('./docker');

const { exec } = require('child_process');

function getCIScript(id) {
    var current = project.getProject(id);
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

function runCI(id) {
    var current = project.getProjectDirs(id);

    if (fs.existsSync(current.ci)) {
        common.rmdir(current.ci);
        common.mkdir(current.ci);
    }

    common.copyDir(current.repo, current.ci);

    var ciScript = getCIScript(id);

    runTasks(ciScript, current.ci, current.logs);

    docker.buildDockerImage()
}

module.exports = {
    getCIScript,
    runCI
}