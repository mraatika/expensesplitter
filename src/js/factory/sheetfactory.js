import {cid} from '../util/utils';
import {t} from '../dictionary/dictionary.js';

var SheetFactory = {

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
            expenses: [],
            transactions: []
        };

        return sheet;
    }
};


export default SheetFactory;