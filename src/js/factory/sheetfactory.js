import {t} from '../dictionary/dictionary.js';
import shortid from 'shortid';

/**
 * Factory for creating new sheets
 * @type {Object}
 */
const SheetFactory = {

    /**
     * Create new sheet
     * @param  {Object} initialProps
     * @return {Object}
     */
    create: function(initialProps) {
        var sheet = {
            id: shortid.generate(),
            dirty: true,
            createdOn: new Date(),
            lastSavedOn: null,
            name: (initialProps.name || '').trim(),
            settings: Object.assign({ currencySymbol: t('app.locales.currency_symbol') }, initialProps.settings),
            participants: [],
            expenses: []
        };

        return sheet;
    }
};


export default SheetFactory;