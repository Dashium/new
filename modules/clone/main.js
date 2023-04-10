const common = require('../common');
const github = require('./github');

async function cloneRepo(url, dest){
    switch (common.getDomains(url)){
        case 'github.com':
            url = common.replaceAll(url, 'https://github.com/', '');
            await github.gitClone(url, dest);
            common.log(`repo ${url} clonned !`, 'clone');
            break;
        default:
            common.error('repo not found !', 'clone');
    }
}

function fetchRepo(url, dest){
    switch (common.getDomains(url)){
        case 'github.com':
            url = common.replaceAll(url, 'https://github.com/', '');
            github.gitFetch(url, dest);
            break;
        default:
            common.error('repo not found !', 'clone');
    }
}

module.exports = {
    clone: cloneRepo,
    fetch: fetchRepo
}