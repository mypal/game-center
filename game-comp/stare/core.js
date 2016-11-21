/**
 * @module stare/core
 */

let Poker = require('../poker/poker'),
    config = require('./config'),
    PokerUtil = require('../poker/util'),
    Util = require('./util');

const DEFAULT_OPT = {
    playerCount: 2,
    pokerCount: 1
};

function deleteCards(originCards, deletedCards) {
    return originCards.filter(origin => !deletedCards.some(deleted => origin.isEqual(deleted)));
}

class Core {
    /**
     * @param {{}} opt
     * @param {number} opt.playerCount
     * @param {number} [opt.pokerCount=1]
     */
    constructor(opt) {
        opt = Object.assign(DEFAULT_OPT, opt);
        /**
         * 玩家人数
         * @type {number}
         * @private
         */
        this._playerCount = opt.playerCount;
        /**
         * 牌堆
         * @type {Poker}
         * @private
         */
        this._deck = new Poker({
            number: opt.pokerCount
        });
        /**
         * 玩家手牌
         * @type {Card[][]}
         * @private
         */
        this._hands = new Array(opt.playerCount);
        for (let i = 0; i < opt.playerCount; i++) {
            this._hands[i] = [];
        }
        /**
         * 出牌玩家
         * @type {number}
         * @private
         */
        this._currentPlayer = Math.floor(Math.random() * this._playerCount) % this._playerCount;
        /**
         * @type {{cards:Card[], set: ?string, numbers: number[], player: number}}
         * @private
         */
        this._lastCards = null;
        /**
         * 场上剩余玩家
         * @type {number}
         * @private
         */
        this._currentPlayerCount = this._playerCount;
        /**
         * 玩家排名
         * @type {number[]}
         * @private
         */
        this._rank = [];
        /**
         * 过牌计数
         * @type {number}
         * @private
         */
        this._foldCount = 0;
        /**
         * @type {Array}
         * @private
         */
        this._playerStatus = new Array(this._playerCount).fill({
            win: false
        }).map(() => {
            return {
                win: false
            }
        });
    }

    /**
     * 开牌
     */
    deal() {
        /**
         * 先手玩家多一张牌
         */
        let cardCount = config.INIT_HAND_LENGTH * this._playerCount + 1;
        let player = this._currentPlayer;
        while (cardCount--) {
            this._hands[player].push(this._deck.pop());
            if (!this._deck.getLeftLength()) {
                break;
            }
            player = (player + 1) % this._playerCount;
        }
    }

    /**
     * 手牌排序
     */
    sortHands() {
        for (let i = 0; i < this._hands.length; i++) {
            this._hands[i].sort((a, b) => {
                a = (a.getRank() + 10) % 13 + (PokerUtil.isJoker(a) ? 13 : a.getSuit() / 10.0);
                b = (b.getRank() + 10) % 13 + (PokerUtil.isJoker(b) ? 13 : b.getSuit() / 10.0);
                if (a > b) {
                    return 1;
                } else if (a < b) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    }

    /**
     * 出牌
     * @param {{}} param
     * @param {number} param.player
     * @param {Card[]} param.cards
     * @param {number[]} param.numbers
     * @param {?string} param.pattern
     * @return {boolean} isFinished
     */
    play(param) {
        console.log('param', param.player, param.cards.map(item => item.toString()).join(' '), param.numbers, param.pattern);
        if (param.player != this._currentPlayer) {
            return false;
        }
        if (param.cards.length == 0) {
            if (this.nextPlayer(this._currentPlayer) == this._lastCards.player || ++this._foldCount >= this._currentPlayerCount) {
                //流局
                this._lastCards = null;
                this._currentPlayer = this.nextPlayer(this._currentPlayer);
                this.supplyCards();
            } else {
                //下家出牌
                this._currentPlayer = this.nextPlayer(this._currentPlayer);
            }
        } else {
            this._foldCount = 0;
            if (this._lastCards && Util.isSucceed(this._lastCards, param) || !this._lastCards && Util.checkSet(param)) {
                this._hands[this._currentPlayer] = deleteCards(this._hands[this._currentPlayer], param.cards);
                this._lastCards = {
                    player: param.player,
                    numbers: param.numbers,
                    cards: param.cards,
                    pattern: param.pattern
                };
                if (!this._hands[this._currentPlayer].length) {
                    this._rank.push(this._currentPlayer);
                    return true;
                }
                this._currentPlayer = this.nextPlayer(this._currentPlayer);
            }
        }
        return false;
    }

    /**
     * 补牌
     */
    supplyCards() {
        let count = this._currentPlayerCount;
        let player = this._currentPlayer;
        while (count-- && this._deck.getLeftLength()) {
            this._hands[player].push(this._deck.pop());
            player = this.nextPlayer(player);
        }
        this.sortHands();
    }

    /**
     * @param {number} player
     * @return {?number}
     */
    nextPlayer(player) {
        let originPlayer = player;
        let count = this._playerCount;
        let total = count;
        player = (player + 1) % count;
        while (total-- && this._playerStatus[player].win) {
            player = (player + 1) % count;
        }
        if (originPlayer == player) {
            return null;
        }
        return player;
    }

    get currentPlayer() {
        return this._currentPlayer;
    }

    showInfo() {
        console.log('current:', this._currentPlayer, 'deck:', this._deck.getLeftLength());
        console.log('last: ', this._lastCards && this._lastCards.player + ', ' + this._lastCards.numbers.join(' ') || '');
        for (let i = 0; i < this._playerCount; i++) {
            this.showHands(i);
        }
    }

    showHands(i) {
        console.log(i, ':', this._hands[i].map(c => c.toString()).join(' '));
    }
}

module.exports = Core;