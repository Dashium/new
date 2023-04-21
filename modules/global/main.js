const common = require('../common');
const dbModule = require('../bdd/main');

async function addPort(port) {
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global', '*', 'id = 1');
            entries[0].json = JSON.parse(entries[0].json);

        if (typeof entries[0].json.ports != 'object') {
            entries[0].json.ports = [];
        }

        entries[0].json.ports.push(port);

        updateGlobal(entries[0]);

        return { message: 'Update successful' };
    } catch (error) {
        common.error(error, 'global');
        return { error: 'Internal server error' };
    }
}

async function getPorts() {
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global', '*', 'id = 1');
            entries[0].json = JSON.parse(entries[0].json);

        if (typeof entries[0].json.ports != 'object') {
            entries[0].json.ports = [];
        }

        return entries[0].json.ports;
    } catch (error) {
        common.error(error, 'global');
        return { error: 'Internal server error' };
    }
}

async function removePort(port) {
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global', '*', 'id = 1');
            entries[0].json = JSON.parse(entries[0].json);

        if (typeof entries[0].json.ports != 'object') {
            entries[0].json.ports = [];
        }
        
        entries[0].json.ports = await common.removeValueFromArray(entries[0].json.ports, port);

        updateGlobal(entries[0]);

        return { message: 'Update successful' };
    } catch (error) {
        common.error(error, 'global');
        return { error: 'Internal server error' };
    }
}

async function updateSHA(sha) {
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global', '*', 'id = 1');
        entries[0].json = JSON.parse(entries[0].json);

        entries[0].json.update = sha;

        updateGlobal(entries[0]);

        return { message: 'Update successful' };
    } catch (error) {
        common.error(error, 'global');
        return { error: 'Internal server error' };
    }
}

async function updateGlobal(data) {
    var db = await dbModule.loadDatabase('dashium');
    const global = await dbModule.selectRows(db, 'global', '*', 'id = 1');

    if (data.json != null) {
        data.json = JSON.stringify(data.json);
    }

    await dbModule.updateRows(db, 'global', data, 'id = 1');

    return global;
}

module.exports = {
    addPort,
    getPorts,
    removePort,
    updateSHA
}