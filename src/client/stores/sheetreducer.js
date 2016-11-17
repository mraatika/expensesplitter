import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import {ArrayUtils} from 'client/util/utils';
import sheetFactory from 'client/factory/sheetfactory';
import participantFactory from 'client/factory/participantfactory';
import expenseFactory from 'client/factory/expensefactory';

/**
 * Store's initial state
 * @type {Object}
 */
const initialState = {
    sheet: {},
    dirty: false
};

/**
 * Sheet related reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function sheetReducer(state = initialState, action) {

    switch(action.type) {
    // ACTIONS
    case Constants.ActionTypes.CREATE_SHEET:
        return immutable(state)
            .set('dirty', true)
            .set('sheet', sheetFactory(action.sheet))
            .value();
    case Constants.ActionTypes.ADD_EXPENSE:
        return immutable(state)
            .set('dirty', true)
            .push('sheet.expenses', expenseFactory(action.expense))
            .value();
    case Constants.ActionTypes.REMOVE_EXPENSE:
        {
            const index = ArrayUtils.findIndexById(state.sheet.expenses, action.expense);
            return immutable(state)
                .set('dirty', true)
                .set(`sheet.expenses.${index}.removed`, true)
                .value();
        }
    case Constants.ActionTypes.ADD_PARTICIPANT:
        return immutable(state)
            .set('dirty', true)
            .push('sheet.participants', participantFactory(action.participant))
            .value();
    case Constants.ActionTypes.REMOVE_PARTICIPANT:
        {
            const index = ArrayUtils.findIndexById(state.sheet.participants, action.participant);
            return immutable(state)
               .set('dirty', true)
               .set(`sheet.participants.${index}.removed`, true)
               .value();
        }
    case Constants.ActionTypes.UPDATE_SHEET:
        return immutable(state)
            .set('dirty', true)
            .assign('sheet', action.update)
            .value();
    // EVENTS
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        return immutable(state)
            .set('dirty', false)
            .set('sheet', action.payload.data.sheet)
            .value();
    // ERRORS
    case Constants.ErrorEventTypes.SAVE_SHEET:
        if (!state.dirty) {
            return immutable.set(state, 'dirty', true);
        }
    }

    return state;
}