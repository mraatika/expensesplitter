'use strict';

import {cid} from '../util/utils';

var SheetFactory = {

    create: function(sheetName) {
        var sheet = {
            id: cid(),
            createdOn: new Date(),
            name: (sheetName || '').trim(),
            participants: [],
            expenses: [],
            transactions: []
        };

        return sheet;
    }
};


export default SheetFactory;