/**
 * @module Poker
 */

let Cards = require('./card');

const DEFAULT_OPTION = {
    number: 1,
    needShuffle: true
};

const CARDS_LENGTH = 54;

class Poker {
    /**
     * @param {{}} [opt]
     * @param {number=1} [opt.number]
     * @param {boolean=true} [opt.needShuffle]
     */
    constructor(opt) {
        opt = Object.assign(DEFAULT_OPTION, opt);
        this.generator(opt.number);
        if (opt.needShuffle) {
            this.shuffle();
        }
        this._length = this._leftCards = this._cards.length;
    }

    /**
     * @param {number} number
     */
    generator(number) {
        let cards = new Array(CARDS_LENGTH);
        let count = 0;
        for (let i = 1; i <= 2; i++) {
            cards[count++] = new Cards({
                suit: 0,
                rank: i
            });
        }
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 13; j++) {
                cards[count++] = new Cards({
                    suit: i,
                    rank: j
                })
            }
        }
        let res = [];
        for (let i = 0; i < number; i++) {
            res = res.concat(cards);
        }
        this._cards = res;
    }

    shuffle() {
        this._cards = this._cards.map((item) => {
            return {
                item,
                random: Math.random()+new Date().getTime()%1000/1000
            }
        }).sort((a, b) => {
            return a.random < b.random;
        }).map((item) => {
            return item.item;
        });
    }

    getLeftLength() {
        return this._leftCards;
    }

    pop() {
        return this._leftCards && this._cards[this._length-(this._leftCards--)] || null;
    }
}

module.exports =  Poker;