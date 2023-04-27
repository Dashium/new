const next = require('next');
const common = require('../common');
const https = require('https');
const fs = require('fs');
const ssl = require('../ssl/main');

const dev = false;
const app = next({ dev, dir: './build' });
const handle = app.getRequestHandler();

const sslOptions = {
    key: fs.readFileSync(ssl.sslFile().key),
    cert: fs.readFileSync(ssl.sslFile().cert)
};

app.prepare().then(() => {
    https.createServer(sslOptions, (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
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
            common.sucess(`Ready on https://${common.global.server.host}:${common.global.server.port}`, 'server');
        });
});
