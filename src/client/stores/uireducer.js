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
    case Constants.ActionTypes.TOGGLE_LOAD_SHEET_DIALOG:
        return updateProperty(state, 'showLoadSheetDialog', action.state);
    case Constants.ActionTypes.TOGGLE_NEW_SHEET_MESSAGE:
        return updateProperty(state, 'newSheetAdded', action.state);
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return reduce(['newSheetAdded', 'showLoadSheetDialog'], (memo, name) => {
            return updateProperty(memo, name, false);
        }, state);
    default:
        return state;
    }
}