import languages from './languages.js';
import store from 'stores/store';

/**
 * Translate function
 * @param  {string} key Translation key
 * @return {string}     translated value
 */
export const t = (key) => {
    const str = languages[store.getState().settings.language][key] || null;

    if (str == null) {
        console.error(`Translation not found for ${key}`);
        return `Missing string: ${key}`;
    }

    return str;
};