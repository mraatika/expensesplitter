import languages from './languages.js';

// default language is english
let currentLanguage = languages.en;

/**
 * Translate function
 * @param  {string} key Translation key
 * @return {string}     translated value
 */
export const t = (key) => {
    var str = currentLanguage[key] || null;

    if (str == null) {
        console.error(`Translation not found for ${key}`);
        return `Missing string: ${key}`;
    }

    return str;
};

export const setLanguage = langCode => {
    currentLanguage = languages[langCode];
};