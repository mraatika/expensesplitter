import shortid from 'shortid';
import {t} from 'dictionary/dictionary.js';


/**
 * Create new sheet
 * @param  {Object} initialProps
 * @return {Object}
 */
export default function create(initialProps) {
    return {
        additionalInformation: '',
        adminKey: shortid.generate(),
        createdOn: new Date(),
        expenses: [],
        id: shortid.generate(),
        lastSavedOn: null,
        name: (initialProps.name || '').trim(),
        participants: [],
        settings: { currencySymbol: t('app.locales.currency_symbol'), ...initialProps.settings }
    };
}