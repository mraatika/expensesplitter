import Constants from 'constants/appconstants';

/**
 * Ui state reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function uiReducer(state = {}, action) {
    switch(action.type) {
    case Constants.ActionTypes.TOGGLE_LOAD_SHEET_DIALOG:
        return { ...state, ...{ showLoadSheetDialog: action.state }};
    case Constants.ActionTypes.TOGGLE_NEW_SHEET_MESSAGE:
        return { ...state, ...{ newSheetAdded: action.state }};
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return { ...state, ...{ newSheetAdded: false }};
    default:
        return state;
    }
}