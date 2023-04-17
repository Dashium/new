const ci = require('../modules/ci/main');
const docker = require('../modules/ci/docker');
const projects = require('../modules/projets/main');

async function startAll(){
    var projectList = await projects.getProjectAll();

    projectList.forEach(async (element) => {
        let container = element.docker.dockerID;
        await docker.startDockerContainer(container);
        await ci.runCI(element.id);
    });
}
startAll();
