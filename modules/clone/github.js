const common = require('../common');
const { simpleGit } = require('simple-git');

const getLatestCommitSha = async (repo) => {
    try {
        const latestCommit = await simpleGit(repo).log(['-n', '1']);
        const latestCommitSha = latestCommit.all[0].hash;
        return latestCommitSha;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    gitClone: function (repo, dest) {
        if (repo == null) { common.error('no repo has been set', 'github'); return; }
        if (dest == null) { common.error('no destination has been set', 'github'); return; }
        return simpleGit().clone(`https://${process.env.GH_TOKEN}@github.com/${repo}`, dest);
    },
    gitFetch: function (repo, dest) {
        return simpleGit(dest).fetch();
    },
    getLatestCommitSha
}