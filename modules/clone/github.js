/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
const common = require('../common');
const { simpleGit } = require('simple-git');
const { Octokit } = require("@octokit/rest");

async function detectRepoPrivacy(url) {
    const {owner, repo} = getRepoInfo(url);
    const octokit = new Octokit();
    const response = await octokit.repos.get({ owner, repo });

    return response.data.private;
}

const getLatestCommitSha = async (repo) => {
    try {
        const latestCommit = await simpleGit(repo).log(['-n', '1']);
        const latestCommitSha = latestCommit.all[0].hash;
        return latestCommitSha;
    } catch (error) {
        common.error(error, 'github');
        return null;
    }
};

function getRepoInfo(url) {
    const regex = /https?:\/\/github.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);
    if (match) {
        const [, owner, repo] = match;
        return { owner, repo };
    }
    return null;
}

const updateRepo = async (path) => {
    const git = simpleGit(path);

    try {
        await git.fetch(); // récupère les derniers changements
        const { files } = await git.status(); // récupère les fichiers modifiés
        await git.pull();
        if (files.length > 0) {
            common.log(`Mise à jour effectuée avec succès !`, 'github');
        } else {
            common.log(`Le repo est déjà à jour.`, 'github');
        }
    } catch (error) {
        common.error(`Erreur lors de la mise à jour : ${error}`, 'github');
    }
};

module.exports = {
    detectRepoPrivacy,
    gitClone: function (repo, dest) {
        if (repo == null) { common.error('no repo has been set', 'github'); return; }
        if (dest == null) { common.error('no destination has been set', 'github'); return; }
        return simpleGit().clone(`https://${process.env.GH_TOKEN}@github.com/${repo}`, dest);
    },
    gitFetch: function (repo, dest) {
        return simpleGit(dest).fetch();
    },
    getLatestCommitSha,
    getRepoInfo,
    updateRepo
}