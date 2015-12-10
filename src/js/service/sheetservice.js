import axios from 'axios';
import _ from 'lodash';
import Q from 'kew';
import ParticipantStore from '../stores/participantstore.js';
import ExpenseStore from '../stores/expensestore.js';

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
     * Get sheet from the server
     * @param  {string} sheetId
     * @return {Promise}
     */
    getSheet(sheetId) {
        const q = Q.defer();

        axios.get(`/api/sheet/${sheetId}`)
            .then((response) => q.resolve(response))
            .catch((err) => q.reject(err));

        return q.promise;
    }

    /**
     * Save or update sheet
     * @param  {Object} sheet
     * @return {Promise}
     */
    saveSheet(sheet) {
        const q = Q.defer();
        const participants = ParticipantStore.getParticipants(sheet.id);
        const expenses = ExpenseStore.getExpenses(sheet.id);
        let saveObject = Object.assign(sheet, { participants, expenses });

        if (sheet._isNew) {
            // omit _isNew parameter before post since
            // it will cause 400 error when tried to add
            // to the database
            saveObject = _.omit(sheet, '_isNew');

            axios.post('/api/sheet', { sheet: saveObject })
                .then((response) => q.resolve(response))
                .catch((err) => q.reject(err));
        } else {
            axios.put('/api/sheet/' + sheet.id, { sheet: saveObject })
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
        const q = Q.defer();

        axios.delete(`/api/sheet/${sheet.id}`)
            .then((response) => q.resolve(response))
            .catch((err) => q.reject(err));

        return q.promise;
    }
}
