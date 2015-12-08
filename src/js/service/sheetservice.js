import axios from 'axios';
import _ from 'lodash';
import Q from 'kew';
import ActionCreators from '../actions/dataactioncreators.js';

/**
 * @class SheetService
 * @description Service class for handling sheets
 *
 * All methods use Q for promises to keep the api identical
 * to other promise based methods. Q also allows client to
 * implement finally block which is not implemented in the
 * es6 promise api.
 */
export default class SheetService {

    /**
     * Save or update sheet
     * @param  {Object} sheet
     * @return {Promise}
     */
    saveSheet(sheet) {
        var q = Q.defer();

        if (sheet._isNew) {
            // omit _isNew parameter before post since
            // it will cause 400 error when tried to add
            // to the database
            let newSheet = _.omit(sheet, '_isNew');

            axios.post('api/sheet', { sheet: newSheet })
                .then((response) => {
                    ActionCreators.changeSheet(newSheet);
                    q.resolve(response);
                })
                .catch((err) => q.reject(err));
        } else {
            axios.put('api/sheet/' + sheet.id, { sheet: sheet })
                .then((response) => q.resolve(response))
                .catch((err) => q.reject(err));
        }

        return q.promise;
    }

    /**
     * Remove sheet
     * @param  {Object} sheet
     * @return {Promise}
     */
    removeSheet(sheet) {
        var q = Q.defer();

        axios.delete('api/sheet/' + sheet.id)
            .then((response) => {
                ActionCreators.removeSheet(sheet.id);
                q.resolve(response);
            })
            .catch((err) => q.reject(err));

        return q.promise;
    }
}
