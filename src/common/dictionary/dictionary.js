import languages from './languages';

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
 * Template string helper. Replace ${key} substrings with corresponding values from vars object
 * @param  {string} str The template string
 * @param  {Object} vars Values to interpolate template with.
 * @param  {boolean} [i10n] If true will treat string as a translation key. Defaults to true.
 * @return {string}
 */
export const tpl =(str, vars = {}, i10n = true) => {
    return Object.keys(vars).reduce((memo, k) => memo.replace(new RegExp('\\${' + k + '}', 'g'), vars[k]), i10n ? t(str) : str);
};

/**
 * Set language used when translating
 * @param  {string} lang
 */
export const setLanguage = (lang) => {
    if (!languages[lang]) throw new Error(`Invalid language definition ${lang}`);
    _language = lang;
};