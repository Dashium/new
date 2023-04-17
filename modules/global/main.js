const common = require('../common');
const dbModule = require('../bdd/main');

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

    console.log(data);
    if (data.json != null) {
        data.json = JSON.stringify(data.json);
    }

    await dbModule.updateRows(db, 'global', data, 'id = 1');

    return global;
}

module.exports = {
    updateSHA
}