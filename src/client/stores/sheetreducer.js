import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import sheetFactory from 'client/factory/sheetfactory';

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
    case Constants.ActionTypes.REMOVE_EXPENSE:
    case Constants.ActionTypes.ADD_PARTICIPANT:
    case Constants.ActionTypes.REMOVE_PARTICIPANT:
        return { ...state, dirty: true };
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