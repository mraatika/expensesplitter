import _ from 'lodash';

/**
 * Factory for creating sheet history models from sheet model
 * @type {Object}
 */
const SheetHistoryFactory = {
    /**
     * Create history model
     * @param  {Object} sheet
     * @return {Object}
     */
    create: function(sheet) {
        return _.pick(sheet, [
            'id',
            'name',
            'createdOn'
        ]);
    }
};

export default SheetHistoryFactory;