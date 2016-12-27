/**
 * @typedef {{}} Player
 * @property {number} id
 * @property {string} nickname
 * @property {boolean} ready
 * @property {number} whereAmI
 */
class Player {
    constructor(opt) {
        this.id = opt.id;
        this.nickname = opt.nickname;

        this.ready = false;
        this.whereAmI = undefined;
    }
}

module.exports = Player;