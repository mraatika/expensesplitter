import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import sheetHistoryFactory from 'client/factory/sheethistoryfactory';
import storageFactory from 'client/factory/storagefactory';
import {LOAD_SHEET_SUCCESS, REMOVE_SHEET_SUCCESS, SAVE_SHEET_SUCCESS} from 'client/stores/sheetreducer';

export const CLEAR_HISTORY = 'expensesplitter/sheethistory/CLEAR_HISTORY';
export const REMOVE_SHEET_HISTORY_ENTRY = 'expensesplitter/sheethistory/REMOVE_SHEET_HISTORY_ENTRY';

// create local storage
const storage = storageFactory(Constants.SHEET_STORE_NAME);

/**
 * Add entry to the state
 * @param  {Object} state current state
 * @param  {Object} sheet
 * @return {Object}
 */
const addEntry = (state, sheet) => {
    const record = sheetHistoryFactory(sheet);
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
const clearHistoryStorage = () => {
    storage.clear();
    return {};
};

/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export default function reducer(state = storage.getAll(), action) {
    switch(action.type) {
    case SAVE_SHEET_SUCCESS:
    case LOAD_SHEET_SUCCESS:
        return addEntry(state, action.payload.data.sheet);
    case REMOVE_SHEET_SUCCESS:
        return deleteEntry(state, action.payload.data.id);
    case REMOVE_SHEET_HISTORY_ENTRY:
        return deleteEntry(state, action.entry.id);
    case CLEAR_HISTORY:
        return clearHistoryStorage();
    default:
        return state;
    }
}

/**
 * Clear sheet history
 * @return {Object}
 */
export function clearHistory() {
    return {
        type: CLEAR_HISTORY
    };
}

/**
 * Remove a single sheet history entry from state and local db
 * @param  {Object} entry
 * @return {Object}
 */
export function removeSheetHistoryEntry(entry) {
    return {
        type: REMOVE_SHEET_HISTORY_ENTRY,
        entry
    };
}