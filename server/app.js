const koa = require('koa'),
    mount = require('koa-mount'),
    router = require('koa-router')(),
    logger = require('koa-logger'),
    render = require('koa-swig'),
    path = require('path');

var app = koa();

app.context.render = render({
    root: path.join(__dirname, '../src/static/'),
    autoescape: false,
    cache: false,
    ext: 'html'
});
app.use(logger());

var index = function *() {
    yield* this.render('index');
};

router.get('/', index);
app.use(router.routes()).use(router.allowedMethods());

const server = require('http').createServer(app.callback()),
    io = require('socket.io').listen(server);

io.on('connection', (socket) => {
    console.log('connect');
    socket.broadcast.emit('talk', 'connect');
});

server.listen(8080);
