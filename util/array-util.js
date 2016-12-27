module.exports = {
    /**
     * @param {{}[]} arr
     * @param {string} property
     * @param {*} value
     * @return {number} index of first found item, -1 if not find
     */
    indexOf: function(arr, property, value) {
        let res = -1;
        arr.some((item, idx) => {
            if (item[property] === value) {
                res = idx;
                return true;
            } else {
                return false;
            }
        });
        return res;
    }
};