import shortid from 'shortid';
import {t} from 'common/dictionary/dictionary';


/**
 * Create new sheet
 * @param  {Object} initialProps
 * @return {Object}
 */
export default function create(props = {}) {
    const {name, settings} = props;

    return {
        additionalInformation: '',
        adminKey: shortid.generate(),
        createdOn: new Date(),
        expenses: [],
        id: shortid.generate(),
        lastSavedOn: null,
        name: (name || '').trim(),
        participants: [],
        settings: { currencySymbol: t('app.locales.currency_symbol'), ...settings }
    };
}