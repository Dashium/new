const common = require('../modules/common');
const docker = require('../modules/ci/docker');
const dbModule = require('../modules/bdd/main');

async function removeDocker(){
    var db = await dbModule.loadDatabase('dashium');
    var data = await dbModule.selectRows(db, 'projects', '*');
    data.forEach(async (curr) => {
        var project = JSON.parse(curr.docker);
        await docker.deleteContainer(project.dockerID);
    });

    await dbModule.closeDatabase(db);

    common.rmfile('./config/global.json');
    common.rmdir('./build');
    common.rmdir('./clusters');
    common.rmdir('./logs');
    common.rmdir('./config');
}

removeDocker();