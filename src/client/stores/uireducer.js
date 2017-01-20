import immutable from 'object-path-immutable';
import {
    LOAD_SHEET,
    LOAD_SHEET_FAIL,
    LOAD_SHEET_SUCCESS,
    SAVE_SHEET,
    SAVE_SHEET_FAIL,
    SAVE_SHEET_SUCCESS
} from 'client/stores/sheetreducer';

/**
 * Action types
 */
export const TOGGLE_LOAD_SHEET_DIALOG = 'expensesplitter/ui/TOGGLE_LOAD_SHEET_DIALOG';
export const TOGGLE_NEW_SHEET_MESSAGE = 'expensesplitter/ui/TOGGLE_NEW_SHEET_MESSAGE';
export const TOGGLE_SETTINGS_SECTION = 'expensesplitter/ui/TOGGLE_SETTINGS_SECTION';

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
export default function reducer(state = {}, action) {
    switch(action.type) {
    case LOAD_SHEET:
        return updateProperty(state, 'isFetching', true);
    case SAVE_SHEET:
        return updateProperty(state, 'isSavingToServer', true);
    case TOGGLE_LOAD_SHEET_DIALOG:
        return updateProperty(state, 'showLoadSheetDialog', action.state);
    case TOGGLE_NEW_SHEET_MESSAGE:
        return updateProperty(state, 'newSheetAdded', action.state);
    case TOGGLE_SETTINGS_SECTION:
        return updateProperty(state, 'showSettings', action.state);
    case LOAD_SHEET_SUCCESS:
        return ['newSheetAdded', 'showLoadSheetDialog', 'isFetching'].reduce((memo, name) => {
            return updateProperty(memo, name, false);
        }, state);
    case SAVE_SHEET_SUCCESS:
    case SAVE_SHEET_FAIL:
        return updateProperty(state, 'isSavingToServer', false);
    case LOAD_SHEET_FAIL:
        return updateProperty(state, 'isFetching', false);
    default:
        return state;
    }
}

/**
 * Toggle load sheet dialog's display state
 * @param  {boolean} state Show or not to show
 * @return {Object}
 */
export function toggleLoadSheetDialog(state) {
    return {
        type: TOGGLE_LOAD_SHEET_DIALOG,
        state
    };
}

/**
 * Toggle new sheet added messages's display state
 * @param  {boolean} state Show or not to show
 * @return {Object}
 */
export function toggleNewSheetAdded(state) {
    return {
        type: TOGGLE_NEW_SHEET_MESSAGE,
        state
    };
}

/**
 * Toggle settings section's display state
 * @param  {boolean} state Show or not to show
 * @return {Object}
 */
export function toggleSettingsSection(state) {
    return {
        type: TOGGLE_SETTINGS_SECTION,
        state
    };
}