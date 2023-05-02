/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
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