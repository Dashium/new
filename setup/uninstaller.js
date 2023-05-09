/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
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