const Player = require('./player'),
    Room = require('./room');

const ROOMS_LIMIT = 10;
let rooms = new Array(ROOMS_LIMIT);

rooms[0] = new Room({
    roomId: 0,
    game: 'stare',
    minSeats: 2,
    maxSeats: 6
});
module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('connection');
        socket.join(0);
        /**
         * todo: register user
         */
        let player = new Player({
            id: Math.round(Math.random()*10000),
            nickname: '赵钱孙李周吴郑王'[Math.floor(Math.random()*8)]
        });
        socket.on('action', function(data) {
            if (player && rooms[data.roomId]) {
                if (player.whereAmI === data.roomId || player.whereAmI === undefined) {
                    rooms[data.roomId][data.action](player) && io.to(data.roomId).emit('update', rooms[data.roomId].getRoomInfo());
                }
            }
        });
        socket.on('disconnect', function() {
            console.log('disconnect');
            player.whereAmI !== undefined && rooms[player.whereAmI].left(player) && io.to(player.whereAmI).emit('update', rooms[player.whereAmI].getRoomInfo());
        })
    });
};
