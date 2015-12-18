import _ from 'lodash';

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
export const NumberUtils = {
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
export const StringUtils = {
    /**
     * Checks if given value is a non empty string
     * @param {string} string
     * @returns {boolean}
     */
    isNonEmptyString: function(string) {
        return (typeof string == 'string') && string.trim().length;
    }
};

/**
 * Date utils
 * @type {Object}
 */
export const DateUtils = {
    /**
     * Format date to given format
     * @param  {Date} date
     * @param  {string} format Format string e.g. "${year}/${month}/${day} ${hour}:${minute}"
     * @return {string}
     */
    format(date, format) {
        if (!_.isDate(date)) date = new Date(date);

        return format
            .replace('${year}', date.getFullYear())
            .replace('${month}', date.getMonth() + 1)
            .replace('${day}', date.getDate())
            .replace('${hour}', date.getHours())
            .replace('${minute}', date.getMinutes());
    }
};

/**
 * URL related utils
 * @type {Object}
 */
export const URLUtils = {
    /**
     * Form a shareable url for given sheet
     * @param  {string} sheetId
     * @return {string}
     */
    formSheetUrl(sheetId) {
        return `${window.location.origin}/sheet/${sheetId}`;
    },

    /**
     * Extract current sheet's id from the url path
     * @return {string | null}
     */
    getCurrentSheetId() {
        const match = window.location.href.match(/\/sheet\/([\w_-]+)\/?/);
        return match ? match[1] : null;
    }
};