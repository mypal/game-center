let it = require("mocha/lib/mocha.js").it,
    before = require("mocha/lib/mocha.js").before,
    describe = require("mocha/lib/mocha.js").describe,
    assert = require('assert');
let Util = require('../../game-comp/stare/util'),
    Card = require('../../game-comp/poker/card');

function genCard(suit, rank) {
    return new Card({
        suit,
        rank
    });
}

describe('stare/util', () => {
    describe('isSameRank', () => {
        it('single card', () => {
            assert.deepEqual(Util.isSingle([genCard(0, 1)]), []);
            assert.deepEqual(Util.isSingle([genCard(1, 1)]), [[1]]);
        });
        it('multiple cards', () => {
            assert.deepEqual(Util.isQuadruple([genCard(0, 1), genCard(1, 10), genCard(3, 10), genCard(2, 10)]), [[10, 10, 10, 10]]);
            assert.deepEqual(Util.isQuadruple([genCard(4, 10), genCard(1, 10), genCard(3, 10), genCard(2, 10)]), [[10, 10, 10, 10]]);
            assert.deepEqual(Util.isQuadruple([genCard(4, 1), genCard(1, 10), genCard(3, 10), genCard(2, 10)]), []);
            assert.deepEqual(Util.isQuadruple([genCard(0, 1), genCard(1, 10), genCard(3, 2), genCard(2, 10)]), []);
        });
    });
    describe('isStraight', () => {
        it('single straight', () => {
            assert.deepEqual(Util.isSingleStraight([genCard(0, 1), genCard(1, 9), genCard(3, 10), genCard(2, 8)]), [[7, 8, 9, 10], [8, 9, 10, 11]]);
            assert.deepEqual(Util.isSingleStraight([genCard(4, 10), genCard(1, 12), genCard(3, 11), genCard(2, 9)]), [[9, 10, 11, 12]]);
            assert.deepEqual(Util.isSingleStraight([genCard(4, 13), genCard(1, 12), genCard(3, 11), genCard(2, 1)]), [[11, 12, 13, 1]]);
            assert.deepEqual(Util.isSingleStraight([genCard(4, 4), genCard(1, 3), genCard(3, 2), genCard(2, 1)]), []);
            assert.deepEqual(Util.isSingleStraight([genCard(4, 4), genCard(1, 3), genCard(3, 2)]), []);
            assert.deepEqual(Util.isSingleStraight([genCard(0, 1), genCard(1, 10), genCard(3, 12), genCard(2, 13)]), [[10, 11, 12, 13]]);
            assert.deepEqual(Util.isSingleStraight([genCard(0, 1), genCard(1, 9), genCard(3, 12), genCard(2, 13)]), []);
        });
        it('double straight', () => {
            assert.deepEqual(Util.isDoubleStraight([genCard(0, 1), genCard(1, 2)]), []);
            assert.deepEqual(Util.isDoubleStraight([genCard(0, 1), genCard(1, 2), genCard(1, 3), genCard(1, 2)]), []);
            assert.deepEqual(Util.isDoubleStraight([genCard(0, 1), genCard(0, 1), genCard(0, 1), genCard(0, 1)]), []);
            assert.deepEqual(Util.isDoubleStraight([genCard(0, 1), genCard(0, 1), genCard(0, 1), genCard(1, 1)]), [[13, 13, 1, 1]]);
            assert.deepEqual(Util.isDoubleStraight([genCard(0, 1), genCard(0, 1), genCard(1, 1), genCard(1, 1), genCard(1, 12), genCard(1, 12), genCard(1, 11), genCard(1, 13)]), [[11, 11, 12, 12, 13, 13, 1, 1]]);
            assert.deepEqual(Util.isDoubleStraight([genCard(0, 1), genCard(0, 1), genCard(1, 1), genCard(1, 1), genCard(1, 12), genCard(1, 12), genCard(1, 11), genCard(1, 10)]), []);
            assert.deepEqual(Util.isDoubleStraight([genCard(1, 3), genCard(1, 3), genCard(1, 4), genCard(1, 4), genCard(1, 5), genCard(1, 6), genCard(1, 5), genCard(1, 6), genCard(1, 7), genCard(1, 7)]), []);
        });
    });
    describe('checkSet', () => {
        it('single', () => {
            assert.ok(Util.checkSet({
                cards: [genCard(1, 1)],
                numbers: [1],
                pattern: 'isSingle'
            }))
        });
        it('double', () => {
            assert.ok(Util.checkSet({
                cards: [genCard(1, 1), genCard(0, 1)],
                numbers: [1, 1],
                pattern: 'isDouble'
            }))
        });
        it('triple', () => {
            assert.ok(Util.checkSet({
                cards: [genCard(1, 1), genCard(0, 2), genCard(2, 1)],
                numbers: [1, 1, 1],
                pattern: 'isTriple'
            }))
        });
        it('quadruple', () => {
            assert.ok(Util.checkSet({
                cards: [genCard(1, 1), genCard(0, 2), genCard(2, 1), genCard(0, 1)],
                numbers: [1, 1, 1, 1],
                pattern: 'isQuadruple'
            }))
        });
        it('single-straight', () => {
            assert.ok(Util.checkSet({
                cards: [genCard(1, 3), genCard(1, 4), genCard(1, 5)],
                numbers: [3, 4, 5],
                pattern: 'isSingleStraight'
            }))
        });
        it('double-straight', () => {
            assert.ok(Util.checkSet({
                cards: [genCard(1, 3), genCard(0, 2), genCard(2, 4), genCard(0, 1)],
                numbers: [3, 3, 4, 4],
                pattern: 'isDoubleStraight'
            }))
        });
    });
});
