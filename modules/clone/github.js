const common = require('../common');
const { simpleGit } = require('simple-git');

module.exports = {
    gitClone: async function(repo, dest){
        if(repo == null){ common.error('no repo has been set', 'github'); return;}
        if(dest == null){ common.error('no destination has been set', 'github'); return;}
        await simpleGit().clone(`https://${process.env.GH_TOKEN}@github.com/${repo}`, dest);
    },
    gitFetch: async function(repo, dest){
        await simpleGit(dest).fetch();
    }
}