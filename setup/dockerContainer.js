const docker = require('../modules/ci/docker');

async function startAll(){
    var containers = await docker.getAllDockerName();
    console.log(containers);
    await docker.startDockerContainer(containers);
}
startAll();
