const config = require('../config/global.json');
const version = require('../package.json');

function printer(txt){
    var n = txt.length;
    var tmp = "                                           |";
        tmp = tmp.slice(n, tmp.length);
    console.log(`|    ${txt}${tmp}`);
}

console.log("|-----------------------------------------------|");
console.log("|   _____            _     _                    |");
console.log("|  |  __ \\          | |   (_)                   |");
console.log("|  | |  | | __ _ ___| |__  _ _   _ _ __ ___     |");
console.log("|  | |  | |/ _\\`/ __| '_ \\| | | | | '_ \` _ \\    |"); 
console.log("|  | |__| | (_| \\__ \\ | | | | |_| | | | | | |   |");
console.log("|  |_____/ \\__,_|___/_| |_|_|\\__,_|_| |_| |_|   |");
console.log("|-----------------------------------------------|");
printer(`Server name: ${config.server.name}`);
printer(`Version: ${version.version}`);
printer(`Web app: http://${config.server.host}:${config.server.port}`);
printer(`API: http://${config.api.host}:${config.api.port}/api`);
console.log("|    ---------------------------------------    |");
console.log("|    © Tai Studio 2021/2023                     |");
console.log("|-----------------------------------------------|");