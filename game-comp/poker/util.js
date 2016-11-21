/**
 * @module Util
 */

/**
 * @type {{isJoker: ((card:Card)=>boolean), isSameRank: ((cards:Card[])=>boolean)}}
 */
let Util = {
    /**
     * @param {Card} card
     * @return {boolean}
     */
    isJoker(card) {
        return card.getSuit() == 0;
    },
    /**
     * @param {Card[]} cards
     * @return {boolean}
     */
    isSameRank(cards) {
        return cards.every((item) => {
            return item.getRank() == cards[0].getRank();
        });
    }
};

module.exports = Util;