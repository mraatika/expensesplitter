import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import SheetHistoryFactory from 'client/factory/sheethistoryfactory';
import storageFactory from 'client/factory/storagefactory';

// create local storage
const storage = storageFactory(Constants.SHEET_STORE_NAME);

/**
 * Add entry to the state
 * @param  {Object} state current state
 * @param  {Object} sheet
 * @return {Object}
 */
const addEntry = (state, sheet) => {
    const record = SheetHistoryFactory.create(sheet);
    const newState = immutable.set(state, sheet.id, record);
    storage.setAll(newState);
    return newState;
};

/**
 * Delete a single entry from the state
 * @param  {Object} state current state
 * @param  {string} id entry id
 * @return {Object}
 */
const deleteEntry = (state, id) => {
    const newState = immutable.del(state, id);
    storage.setAll(newState);
    return newState;
};

/**
 * Clear the state
 * @return {Object}
 */
const clearHistory = () => {
    storage.clear();
    return {};
};

/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function sheetHistoryReducer(state = storage.getAll(), action) {
    switch(action.type) {
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return addEntry(state, action.payload.data.sheet);
    case Constants.EventTypes.REMOVE_SHEET_SUCCESS:
        return deleteEntry(state, action.payload.data.id);
    case Constants.ActionTypes.REMOVE_SHEET_HISTORY_ENTRY:
        return deleteEntry(state, action.entry.id);
    case Constants.ActionTypes.CLEAR_HISTORY:
        return clearHistory();
    default:
        return state;
    }
}