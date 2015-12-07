import axios from 'axios';
import _ from 'lodash';
import ActionCreators from '../actions/dataactioncreators.js';

/**
 * @class SheetService
 * @description Service class for handling sheets
 */
export default class SheetService {

    /**
     * Save or update sheet
     * @param  {Object} sheet
     * @return {Promise}
     */
    saveSheet(sheet) {
        if (sheet._isNew) {
            let newSheet = _.omit(sheet, '_isNew');

            return axios.post('api/sheet', { sheet: newSheet })
                .then(() => {
                    ActionCreators.changeSheet(newSheet);
                });
        }

        return axios.put('api/sheet/' + sheet.id, { sheet: sheet });
    }

    /**
     * Remove sheet
     * @param  {Object} sheet
     * @return {Promise}
     */
    removeSheet(sheet) {
        return axios.delete('api/sheet/' + sheet.id)
            .then(() => ActionCreators.removeSheet(sheet.id));
    }
}
