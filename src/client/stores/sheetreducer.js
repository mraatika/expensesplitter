import {some} from 'lodash';
import Constants from 'client/constants/appconstants';
import sheetFactory from 'client/factory/sheetfactory';

/**
 * Store's initial state
 * @type {Object}
 */
const initialState = {
    sheet: {},
    dirty: false
};

/**
 * Update state property if value changes
 * @param  {Object} state
 * @param  {string} name
 * @param  {*} value
 * @return {Object}
 */
const updateProperties = (state, properties) => {
    const isChanged = some(properties, (v, k) => state[k] !== v);
    return !isChanged ? state : {...state, ...properties};
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
        return updateProperties(state, { dirty: true, sheet: sheetFactory(action.sheet)});
    case Constants.ActionTypes.UPDATE_SHEET:
        return updateProperties(state, { dirty: true, sheet: { ...state.sheet, ...action.update }});
    // EVENTS
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        return updateProperties(state, { dirty: false, sheet: action.payload.data.sheet });
    // ERRORS
    case Constants.ErrorEventTypes.SAVE_SHEET:
        return updateProperties(state, { dirty: true });
    default:
        return state;
    }
}