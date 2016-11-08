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
 * Sheet related reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function sheetReducer(state = initialState, action) {

    switch(action.type) {

    // ACTIONS
    case Constants.ActionTypes.CREATE_SHEET:
        {
            const sheet = sheetFactory(action.sheet);
            return { ...state, sheet, dirty: true };
        }
    case Constants.ActionTypes.UPDATE_SHEET:
        {
            const sheet = {...state.sheet, ...action.update};
            return { ...state, sheet, dirty: true };
        }

    // EVENTS

    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return {
            ...state,
            sheet: action.payload.data.sheet,
            dirty: false
        };
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        return {
            ...state,
            sheet: action.payload.data.sheet,
            dirty: false
        };

    // ERRORS
    case Constants.ErrorEventTypes.SAVE_SHEET:
        return { ...state,  dirty: true };
    default:
        return state;
    }
}