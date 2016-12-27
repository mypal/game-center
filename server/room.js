const Events = require('events'),
    ArrayUtil = require('../util/array-util');

class Room extends Events {
    /**
     * @param {{}} opt
     * @param {number} opt.roomId
     * @param {string} opt.game
     * @param {number} opt.minSeats
     * @param {number} opt.maxSeats
     */
    constructor(opt) {
        super();
        this.id = opt.roomId;
        this.game = opt.game;
        this.minSeats = opt.minSeats;
        this.maxSeats = opt.maxSeats;
        this.seats = [];
        /**
         * @type {string} waiting ready ongoing
         */
        this.status = 'waiting';
    }
    /**
     * @param {Player} player
     * @return {boolean} join success
     */
    join(player) {
        if (this.seats.length < this.maxSeats && !~ArrayUtil.indexOf(this.seats, 'id', player.id)) {
            player.whereAmI = this.id;
            this.seats.push(player);
            return true;
        } else {
            return false;
        }
    }
    /**
     * @param {Player} player
     * @return {boolean} join success
     */
    left(player) {
        let idx = ArrayUtil.indexOf(this.seats, 'id', player.id);
        if (~idx) {
            this.seats.splice(idx, 1);
            return true;
        }
        return false;
    }
    /**
     * @param {Player} player
     */
    ready(player) {
        let idx = ArrayUtil.indexOf(this.seats, 'id', player.id);
        if (~idx) {
            this.seats[idx].ready = true;
            return true;
        }
        return false;
    }
    /**
     * @param {Player} player
     */
    unready(player) {
        let idx = ArrayUtil.indexOf(this.seats, 'id', player.id);
        if (~idx) {
            this.seats[idx].ready = false;
            return true;
        }
        return false;
    }
    getRoomInfo() {
        return {
            roomId: this.id,
            status: this.status,
            seats: this.seats
        }
    }
}

module.exports = Room;