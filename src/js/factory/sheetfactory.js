import {cid} from '../util/utils';
import {t} from '../dictionary/dictionary.js';

/**
 * Factory for creating new sheets
 * @type {Object}
 */
const SheetFactory = {

    /**
     * Create new sheet
     * @param  {string} sheetName
     * @return {Object}
     */
    create: function(sheetName) {
        var sheet = {
            id: cid(),
            _isNew: true,
            createdOn: new Date(),
            name: (sheetName || '').trim(),
            settings: {
                currencySymbol: t('app.locales.currency_symbol')
            },
            participants: [],
            expenses: []
        };

        return sheet;
    }
};


export default SheetFactory;