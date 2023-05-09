/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

const { App } = require("@octokit/app");
const common = require('../common');

async function getInstall(APP_ID, PEMfile) {
    const app = new App({
        appId: APP_ID,
        privateKey: PEMfile,
    });

    try {
        const data = [];
        await app.eachInstallation((user) => {
            data.push(user);
        });
        return data;
    } catch (error) {
        common.error(error, 'github integ');
    }
}

async function getRepos(APP_ID, PEMfile) {
    const app = new App({
        appId: APP_ID,
        privateKey: PEMfile,
    });

    try {
        const data = [];
        await app.eachRepository((repo) => {
            data.push(repo);
        });
        return data;
    } catch (error) {
        common.error(error, 'github integ');
    }
}

module.exports = {
    getInstall,
    getRepos
}