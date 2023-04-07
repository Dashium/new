const common = require('../common');
const github = require('./github');

function cloneRepo(url, dest){
    switch (common.getDomains(url)){
        case 'github.com':
            url = common.replaceAll(url, 'https://github.com/', '');
            github.gitClone(url, dest);
            break;
        default:
            common.error('repo not found !');
    }
}

function fetchRepo(url, dest){
    switch (common.getDomains(url)){
        case 'github.com':
            url = common.replaceAll(url, 'https://github.com/', '');
            github.gitFetch(url, dest);
            break;
        default:
            common.error('repo not found !');
    }
}

module.exports = {
    clone: cloneRepo,
    fetch: fetchRepo
}