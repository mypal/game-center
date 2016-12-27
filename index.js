require('babel-register');
require('./server/app');

/*
const Stare = require('./game-comp/stare/core'),
    readline = require('readline'),
    Card = require('./game-comp/poker/card');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let stare = new Stare({
    playerCount: 3,
});
stare.deal();
stare.sortHands();

stare.showInfo();

let query = () => {
    rl.question('play:', (input) => {
        if (input != 'exit') {
            let spl = input.split('|');
            let cards = [];
            let oriCards = spl[0].split(' ');
            for (let i = 0; i < oriCards.length && oriCards.length > 1; i += 2) {
                cards.push(new Card({
                    suit: oriCards[i],
                    rank: oriCards[i+1]
                }));
            }
            let numbers = spl[1].split(' ').map(item => +item);
            let pattern = spl[2] && spl[2].trim();
            if (!stare.play({
                    player: stare.currentPlayer,
                    cards,
                    numbers,
                    pattern: pattern || 'isSingle'
                })) {
                console.log();
                stare.showInfo();
                query();
            } else {
                stare.showInfo();
                rl.close();
            }
        }
    });
};

query();
*/
