const Koa = require('koa'),
    logger = require('koa-logger'),
    router = require('koa-router')(),
    send = require('koa-send'),
    views = require('koa-views'),
    bodyParser = require('koa-bodyparser'),
    path = require('path'),
    config = require('../common-config.json'),
    routes = require('./routes'),
    Stare = require('../game-comp/stare/core');

let app = new Koa();

app.use(logger());

app.use(bodyParser());

const staticFileContent = config.prefix+'/dist/';
app.use(async function (ctx, next) {
    if (ctx.path.startsWith(staticFileContent)) {
        await send(ctx, ctx.path.substr(staticFileContent.length), {
            root: path.join(__dirname, '../dist')
        });
    } else {
        await next();
    }
});

router.prefix(config.prefix);
for (let path in routes) {
    if (routes.hasOwnProperty(path)) {
        if (typeof routes[path] === 'function') {
            router.get(path, routes[path]);
        } else {
            router[routes[path].method](path, routes[path].action);
        }
    }
}

app.use(views(path.join(__dirname, '../view'), {
    extension: 'hbs',
    map: {
        hbs: 'handlebars'
    }
}));

app.use(router.routes()).use(router.allowedMethods());

const server = require('http').createServer(app.callback()),
    io = require('socket.io').listen(server);

require('./rooms')(io);

server.listen(8080);
