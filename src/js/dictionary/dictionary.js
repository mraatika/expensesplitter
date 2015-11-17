import english from './en.json';

/**
 * Dictionary to be used
 * @type {object}
 */
export const lang = english;
/**
 * Translate function
 * @param  {string} key Translation key
 * @return {string}     translated value
 */
export const t = (key) => {
    var str = lang[key] || null;

    if (str == null) {
        console.error(`Translation not found for ${key}`);
        return `Missing string: ${key}`;
    }

    return str;
};