import languages from './languages.js';

let _language = 'en';

/**
 * Translate function
 * @param  {string} key Translation key
 * @return {string}     translated value
 */
export const t = (key) => {
    const str = languages[_language][key] || null;

    if (str == null) {
        console.error(`Translation not found for ${key}`);
        return `Missing string: ${key}`;
    }

    return str;
};

/**
 * Set language used when translating
 * @param  {string} lang
 */
export const setLanguage = (lang) => {
    if (!languages[lang]) throw new Error(`Invalid language definition ${lang}`);
    _language = lang;
};