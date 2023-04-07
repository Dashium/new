const docker = require('./modules/ci/docker');

docker.pullDockerImage('ubuntu:latest');

docker.dockerCreate('test', 'ubuntu:latest', 'temp-dir');

docker.runDockerContainer('test', 'ubuntu:latest');