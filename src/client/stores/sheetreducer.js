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
const initialState = { dirty: false };

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
        return {... state, ...sheetFactory(action.sheet), dirty: true };
    case Constants.ActionTypes.ADD_EXPENSE:
        return immutable(state)
            .set('dirty', true)
            .push('expenses', expenseFactory(action.expense))
            .value();
    case Constants.ActionTypes.REMOVE_EXPENSE:
        {
            const index = ArrayUtils.findIndexById(state.expenses, action.expense);
            return immutable(state)
                .set('dirty', true)
                .set(`expenses.${index}.removed`, true)
                .value();
        }
    case Constants.ActionTypes.ADD_PARTICIPANT:
        return immutable(state)
            .set('dirty', true)
            .push('participants', participantFactory(action.participant))
            .value();
    case Constants.ActionTypes.REMOVE_PARTICIPANT:
        {
            const index = ArrayUtils.findIndexById(state.participants, action.participant);
            return immutable(state)
               .set('dirty', true)
               .set(`participants.${index}.removed`, true)
               .value();
        }
    case Constants.ActionTypes.UPDATE_SHEET:
        return { ...state, ...action.update, dirty: true };
    // EVENTS
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        return {...state, ...action.payload.data.sheet, dirty: false };
    // ERRORS
    case Constants.ErrorEventTypes.SAVE_SHEET:
        if (!state.dirty) {
            return immutable.set(state, 'dirty', true);
        }
    }

    return state;
}