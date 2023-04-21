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