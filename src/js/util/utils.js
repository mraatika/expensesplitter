'use strict';

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

/**
 * Create a client id
 * @return {function}
 * @returns {string}
 */
export const cid = () => {
    return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
};

/**
 * Number utils
 * @type {Object}
 */
export const Number = {
    /**
     * Round number to given decimal
     * @param  {number} value
     * @param  {number} decimals
     * @return {number} rounded value
     */
    round: function(value, decimals) {
        decimals = Math.pow(10, decimals);
        if (isNaN(decimals)) return value;
        return Math.round(value * decimals) / decimals;
    }
};

/**
 * String utils
 * @type {Object}
 */
export const String = {
    /**
     * Checks if given value is a non empty string
     * @param {string} string
     * @returns {boolean}
     */
    isNonEmptyString: function(string) {
        return (typeof string == 'string') && string.trim().length;
    }
};