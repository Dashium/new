const next = require('next');
const config = require('../../config/global.json');

const dev = false;
const app = next({ dev, dir: './build' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    require('http')
        .createServer((req, res) => {
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
        .listen(config.server.port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://${config.server.host}:${config.server.port}`);
        });
});

