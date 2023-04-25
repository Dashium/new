const heart = require('./modules/global/heart');

async function init(){
    await heart.startScript();
}
init();