/**
 * @module Card
 */

// const SUITS = ['🃏', '♣️', '♦️', '♥️', '♠️'];
const SUITS = ['J', '♣', '♦', '♥', '♠'];
const RANK = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class Card {
    /**
     * @param {{}} opt
     * @param {number} opt.suit 0-Jokers 1-Clubs 2-Diamonds 3-Hearts 4-Spades
     * @param {number} opt.rank 1~13 1-black joker 2-red joker
     */
    constructor(opt) {
        if (opt.suit < 0 || opt.suit > 4 || opt.rank < 1 || opt.rank > 13) {
            throw new Error('param invalid');
        }
        const suit = +opt.suit;
        const rank = +opt.rank;
        this.getSuit = () => suit;
        this.getRank = () => rank;
    }

    /**
     * @return {{suit: number, rank: number}}
     */
    get() {
        return {
            suit: this.getSuit(),
            rank: this.getRank()
        }
    }

    /**
     * @param {Card} card
     */
    isEqual(card) {
        return card.getSuit() == this.getSuit() && card.getRank() == this.getRank();
    }

    /**
     * @return {string}
     */
    toString() {
        const { suit, rank } = this.get();
        return SUITS[suit]+(suit ? RANK[rank] : (rank == 1 ? 'B' : 'R'));
    }

    /**
     * @param {number} rank
     * @return {string}
     */
    static rankToString(rank) {
        return RANK[rank];
    }
}

module.exports = Card;