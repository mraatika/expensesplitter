import {isDate} from 'lodash';

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
        if (!isDate(date)) date = new Date(date);
        const minutes = date.getMinutes();
        const hours = date.getHours();

        return format
            .replace('${year}', date.getFullYear())
            .replace('${month}', date.getMonth() + 1)
            .replace('${day}', date.getDate())
            .replace('${hour}', hours < 10 ? ('0' + hours) : hours)
            .replace('${minute}', minutes < 10 ? ('0' + minutes) : minutes);
    }
};

/**
 * Array related utility functions
 * @type {Object}
 */
export const ArrayUtils = {
    /**
     * Find array entry's index based on it's id
     * @param  {Array} haystack
     * @param  {Object|string} entry
     * @return {number}
     */
    findIndexById(haystack, entry) {
        const id = entry.id || entry;
        return haystack.findIndex(e => e.id === id);
    },

    /**
     * Find array entry based on it's id
     * @param  {Array} haystack
     * @param  {Object|string} entry
     * @return {Object}
     */
    findById(haystack, entry) {
        const id = entry.id || entry;
        return haystack.find(e => e.id === id);
    }
};

/**
 * Find a key following a given fragment
 * @private
 * @param  {string} path
 * @param  {string} fragment
 * @return {string|null}
 */
const _findKeyFromPath = (path, fragment) => {
    // always end with slash for making the regex more simple
    if (path[path.length - 1] !== '/') path += '/';
    const match = path.match(new RegExp(`\\/${fragment}\\/([\\w_-]+)\\/`));
    return match ? match[1] : null;
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
     * Form route for a subpage using given parameters
     * @param  {string} fragment
     * @param  {string} [sheetId]
     * @param  {string} [adminKey]
     * @return {string}
     */
    formSubpageUrl(fragment, sheetId, adminKey) {
        return `${sheetId ? `/sheet/${sheetId}` : ''}${adminKey ? `/admin/${adminKey}` : ''}${fragment}`;
    },

    /**
     * Form valid route for given page
     * @param  {string} pageFragment Page name e.g. /participants
     * @param  {string} [path] Path to search from
     * @return {string} valid router route
     */
    formSubpageURLFromLocation(pageFragment, path = window.location.href) {
        const adminKey = URLUtils.getAdminKey(path);
        const sheetId = URLUtils.getCurrentSheetId(path);
        return URLUtils.formSubpageUrl(pageFragment, sheetId, adminKey);
    },

    /**
     * Extract current sheet's id from the given path
     * @param {string} [path]
     * @return {string|null}
     */
    getCurrentSheetId(path = window.location.href) {
        return _findKeyFromPath(path, 'sheet');
    },

    /**
     * Extract admin key from the given path
     * @param  {string} [path]
     * @return {string|null}
     */
    getAdminKey(path = window.location.href) {
        return _findKeyFromPath(path, 'admin');
    }
};