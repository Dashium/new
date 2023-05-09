/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/


const common = require('../modules/common');
const version = require('../package.json');

function printer(txt){
    var n = txt.length;
    var tmp = "                                           |";
        tmp = tmp.slice(n, tmp.length);
    console.log(`|    ${txt}${tmp}`);
}

async function init(){
    const config = common.global;

    console.log("|-----------------------------------------------|");
    console.log("|   _____            _     _                    |");
    console.log("|  |  __ \\          | |   (_)                   |");
    console.log("|  | |  | | __ _ ___| |__  _ _   _ _ __ ___     |");
    console.log("|  | |  | |/ _\\`/ __| '_ \\| | | | | '_ \` _ \\    |"); 
    console.log("|  | |__| | (_| \\__ \\ | | | | |_| | | | | | |   |");
    console.log("|  |_____/ \\__,_|___/_| |_|_|\\__,_|_| |_| |_|   |");
    console.log("|-----------------------------------------------|");

    if(config != null){
        printer(`Server name: ${config.server.name}`);
        printer(`Version: ${version.version}`);
        printer(`Web app: http://${config.server.host}:${config.server.port}`);
        printer(`API: http://${config.api.host}:${config.api.port}/api`);
    }
    else{
        printer(`Welcome to Dahsium !`);
        printer(`Please feel free to answer any questions.`);
    }

    console.log("|    ---------------------------------------    |");
    console.log("|    © Tai Studio 2021/2023                     |");
    console.log("|-----------------------------------------------|");
}

init();