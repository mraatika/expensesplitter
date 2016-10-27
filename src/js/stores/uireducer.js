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
    default:
        return state;
    }
}