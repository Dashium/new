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
                common.sucess(`Ready on http://${common.global.server.host}:${common.global.server.port} [DEV MODE]`, 'server');
            } else {
                common.sucess(`Ready on https://${common.global.server.host}:${common.global.server.port}`, 'server');
            }
        });
});
