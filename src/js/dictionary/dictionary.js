import english from './languages/en.json';
import finnish from './languages/fi.json';

const languages = {
    en: english,
    fi: finnish
};

let currentLanguage= languages.en;

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