import Constants from 'constants/appconstants';
import SheetFactory from 'factory/sheetfactory';

/**
 * Store's initial state
 * @type {Object}
 */
const initialState = {
    sheet: {},
    isFetching: false,
    dirty: false,
    isSavingToServer: false
};


/**
 * Sheet related reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function sheet(state = initialState, action) {

    switch(action.type) {

    // ACTIONS

    case Constants.ActionTypes.REQUEST_SHEET:
        return {...state, isFetching: true };
    case Constants.ActionTypes.CREATE_SHEET:
        {
            const sheet = SheetFactory.create(action.sheet);
            return {...state, sheet, dirty: true };
        }
    case Constants.ActionTypes.SAVE_SHEET:
        return {...state, isSavingToServer: true };
    case Constants.ActionTypes.UPDATE_SHEET:
        {
            const sheet = {...state.sheet, ...action.update};
            return {...state, sheet, dirty: true };
        }

    // EVENTS

    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return {...state,
            isFetching: false,
            sheet: action.sheet,
            dirty: false
        };
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        return { ...state,
            sheet: action.sheet,
            dirty: false,
            isSavingToServer: false
        };

    // ERRORS

    case Constants.ErrorEventTypes.LOAD_SHEET:
        return { ...state, isFetching: false };
    case Constants.ErrorEventTypes.SAVE_SHEET:
        return { ...state, dirty: true, isSavingToServer: false };
    default:
        return state;
    }
}