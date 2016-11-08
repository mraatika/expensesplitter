import immutable from 'object-path-immutable';
import {reduce} from 'lodash';
import Constants from 'constants/appconstants';

/**
 * Update state property if value changes
 * @param  {Object} state
 * @param  {string} name
 * @param  {*} value
 * @return {Object}
 */
const updateProperty = (state, name, value) => {
    if (state[name] !== value) {
        return immutable.set(state, name, value);
    }

    return state;
};

/**
 * Ui state reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function uiReducer(state = {}, action) {
    switch(action.type) {
    case Constants.ActionTypes.LOAD_SHEET:
        return updateProperty(state, 'isFetching', true);
    case Constants.ActionTypes.SAVE_SHEET:
        return updateProperty(state, 'isSavingToServer', true);
    case Constants.ActionTypes.TOGGLE_LOAD_SHEET_DIALOG:
        return updateProperty(state, 'showLoadSheetDialog', action.state);
    case Constants.ActionTypes.TOGGLE_NEW_SHEET_MESSAGE:
        return updateProperty(state, 'newSheetAdded', action.state);
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return reduce(['newSheetAdded', 'showLoadSheetDialog', 'isFetching'], (memo, name) => {
            return updateProperty(memo, name, false);
        }, state);
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
    case Constants.ErrorEventTypes.SAVE_SHEET:
        return updateProperty(state, 'isSavingToServer', false);
    case Constants.ErrorEventTypes.LOAD_SHEET:
        return updateProperty(state, 'isFetching', false);
    default:
        return state;
    }
}