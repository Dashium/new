/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
const next = require('next');
const common = require('../common');
const https = require('https');
const ssl = require('../ssl/main');

const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const dev = isDev ? true : false;
const dir = isDev ? './modules/dashboard' : './build';
const app = next({ dev, dir: dir });
const handle = app.getRequestHandler();

const SSLfile = ssl.getSSL();

app.prepare().then(() => {
    https.createServer(SSLfile, (req, res) => {
        const parsedUrl = require('url').parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === '/health') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'UP' }));
            return;
        }

        handle(req, res, parsedUrl);
    })
        .listen(common.global.server.port, (err) => {
            if (err) throw err;
            if (isDev) {
                common.sucess(`Ready on https://${common.global.server.host}:${common.global.server.port} [DEV MODE]`, 'server');
            } else {
                common.sucess(`Ready on https://${common.global.server.host}:${common.global.server.port}`, 'server');
            }
        });
});
