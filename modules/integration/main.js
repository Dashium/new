/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
const dbModule = require('../bdd/main');
const common = require('../common');
const fs = require('fs');
const github = require('./github');
const path = require('path');

async function addIntegration(service, appID, key){
    var db = await dbModule.loadDatabase('dashium');
    const integ = await dbModule.selectRows(db, 'integrations', '*', 'service = ?', [service]);

    if (integ.length > 0) {
        common.error(`Erreur : Le service ${service} est déjà installer`, 'integration');
        return null;
    }

    await dbModule.insertRow(db, 'integrations', {
        'service': service,
        'appID': appID,
        'key': key
    });

    return {ok: 'integrations added !'};
}

async function getData(service) {
    var db = await dbModule.loadDatabase('dashium');
    const integ = await dbModule.selectRows(db, 'integrations', '*', 'service = ?', [service]);

    if (integ.length == 0) {
        common.error(`Error, ${service} not setup`, 'integration');
        return;
    }

    const pemFILE = path.join(__dirname, '../../config/', `${service}.pem`);

    if(!fs.existsSync(pemFILE)){
        common.error(`Error, ${pemFILE} not found`, 'integration');
        return;
    }

    const privateKey = fs.readFileSync(pemFILE); //integ[0].key

    common.log(`Service ${service} loaded`, 'integration');
    
    return {
        APP_ID: integ[0].appID,
        pemFILE: privateKey
    };
}

async function getRepos(service) {
    const { APP_ID, pemFILE } = await getData(service);
    var data = {};
    switch (service) {
        case 'github':
            data = await github.getRepos(APP_ID, pemFILE);
            break;
        default:
            return false;
    }
    return data;
}

async function getUsers(service) {
    const { APP_ID, pemFILE } = await getData(service);

    switch (service) {
        case 'github':
            await github.getInstall(APP_ID, pemFILE);
            break;
        default:
            return false;
    }
}

module.exports = {
    addIntegration,
    getRepos,
    getUsers
}