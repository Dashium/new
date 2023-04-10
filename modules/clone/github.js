const common = require('../common');
const { simpleGit } = require('simple-git');

module.exports = {
    gitClone: function(repo, dest){
        if(repo == null){ common.error('no repo has been set', 'github'); return;}
        if(dest == null){ common.error('no destination has been set', 'github'); return;}
        return simpleGit().clone(`https://${process.env.GH_TOKEN}@github.com/${repo}`, dest);
    },
    gitFetch: function(repo, dest){
        return simpleGit(dest).fetch();
    }
}