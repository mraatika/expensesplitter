import shortid from 'shortid';
import {t} from 'dictionary/dictionary.js';


/**
 * Create new sheet
 * @param  {Object} initialProps
 * @return {Object}
 */
export default function create(initialProps) {
    return {
        id: shortid.generate(),
        createdOn: new Date(),
        lastSavedOn: null,
        name: (initialProps.name || '').trim(),
        settings: { currencySymbol: t('app.locales.currency_symbol'), ...initialProps.settings },
        participants: [],
        expenses: [],
        additionalInformation: ''
    };
}