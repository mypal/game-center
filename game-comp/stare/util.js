/**
 * @module Util
 */

/**
 * @see http://wenku.baidu.com/link?url=zpqDW2QTDS04zOon74rnZ1uFKe3z98dcmawdYFjD1B1LRxr8KMj8ifeTIgcZLCHk3_KqB4d5lQnwC3D-q3mVreHlM2bIgPYB07YMiEKe6OS
 */

let PokerUtil = require('../poker/util'),
    Card = require('../poker/card');

function containNumbers(numbers, numbersList) {
    return numbersList.some(item => {
        return numbers.length == item.length && item.every((number, idx) => number == numbers[idx]);
    });
}

function genStraight(min, max, times) {
    let res = [];
    for (let i = min; i <= max; i++) {
        for (let j = 0; j < times; j++) {
            res.push((i-1)%13+1);
        }
    }
    return res;
}

/**
 * @param {Card[]} cards
 * @param {number} [times=1]
 * @return {number[][]}
 */
function isStraight(cards, times) {
    times = times || 1;
    let sets = [];
    for (let i = 2; i <= 14; i++) {
        sets[i] = 0;
    }

    let jokerCount = 0;
    let min = 15, max = 0;

    cards.forEach((item) => {
        if (!PokerUtil.isJoker(item)) {
            let rank = (item.getRank()+11)%13+2;
            sets[rank]++;
            min = Math.min(min, rank);
            max = Math.max(max, rank);
        } else {
            jokerCount++;
        }
    });
    if (max && min != 2) {
        for (let i = min; i <= max; i++) {
            if (sets[i] > times) {
                return [];
            } else {
                jokerCount -= times-sets[i];
                if (jokerCount < 0) {
                    return [];
                }
            }
        }
        let res = [];
        if (jokerCount % times == 0) {
            let count = Math.round(jokerCount/times);
            let straightMin = Math.max(3, min-count), straightMax = Math.min(14, max+count);
            for (let i = straightMin; max+count-min+i <= straightMax; i++) {
                res.push(genStraight(i, max+count-min+i, times));
            }
        }
        return res;
    } else {
        return [];
    }
}

function genSame(rank, number) {
    let res = [];
    while (number--) {
        res.push(rank);
    }
    return res;
}

/**
 * @param {Card[]} cards
 * @param {number} number
 * @return {number[][]}
 */
function isSameRank(cards, number) {
    if (cards.length != number) {
        return [];
    }
    let filter = cards.filter((item) => {
        return !PokerUtil.isJoker(item);
    });
    if (filter.length && PokerUtil.isSameRank(filter)) {
        return [genSame(filter[0].getRank(), cards.length)];
    } else {
        return [];
    }
}

/**
 * @param numbers
 * @return {boolean}
 */
function isSameNumber(numbers) {
    return numbers.every(item => numbers[0] == item);
}

function isStraightNumber(numbers) {

}

const patternS = ['isSingle', 'isDouble', 'isTriple', 'isQuadruple', 'isSingleStraight', 'isDoubleStraight'];
const BOOM = patternS[3];

module.exports = {
    /**
     * @param {Card[]} cards
     * @return {number[][]}
     */
    isSingle(cards) {
        return isSameRank(cards, 1);
    },
    /**
     * @param {Card[]} cards
     * @return {number[][]}
     */
    isDouble(cards) {
        return isSameRank(cards, 2);
    },
    /**
     * @param {Card[]} cards
     * @return {number[][]}
     */
    isTriple(cards) {
        return isSameRank(cards, 3);
    },
    /**
     * @param {Card[]} cards
     * @return {number[][]}
     */
    isQuadruple(cards) {
        return isSameRank(cards, 4);
    },
    /**
     * @param {Card[]} cards
     * @return {number[][]}
     */
    isSingleStraight(cards) {
        return isStraight(cards);
    },
    /**
     * @param {Card[]} cards
     * @return {number[][]}
     */
    isDoubleStraight(cards) {
        return cards.length > 2 && cards.length <= 8 && cards.length % 2 == 0 && isStraight(cards, 2) || [];
    },
    /**
     * @param {{}} param
     * @param {Card[]} param.cards
     * @param {number[]} param.numbers
     * @param {number[]} param.pattern
     * @return {boolean}
     */
    checkSet(param) {
        return !!(patternS.indexOf(param.pattern) != -1 && containNumbers(param.numbers, this[param.pattern](param.cards)));
    },
    /**
     * @param {{}} prev
     * @param {Card[]} prev.cards
     * @param {number[]} prev.numbers
     * @param {number[]} prev.pattern
     * @param {{}} curr
     * @param {Card[]} curr.cards
     * @param {number[]} curr.numbers
     * @param {number[]} curr.pattern
     * @return {boolean}
     */
    isSucceed(prev, curr) {
        if (!this.checkSet(curr)) {
            return false;
        }
        if (prev.pattern != curr.pattern && curr.pattern != BOOM) {
            return false;
        }
        if (prev.pattern == curr.pattern) {
            return prev.numbers[0]+1 == curr.numbers[0] || prev.numbers[0] != 2 && curr.numbers[0] == 2;
        } else {
            return curr.pattern == BOOM;
        }
    }
};