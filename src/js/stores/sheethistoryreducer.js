import {omit} from 'lodash';
import Constants from 'constants/appconstants';
import SheetHistoryFactory from 'factory/sheethistoryfactory';
import storageFactory from 'factory/storagefactory';

// create local storage
const storage = storageFactory.create(Constants.SHEET_STORE_NAME);

/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function sheetHistory(state = storage.getAll(), action) {
    const {sheet} = action;
    let newState = Object.assign({}, state);
    let shouldSaveChanges = false;

    switch(action.type) {
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        {
            const record = SheetHistoryFactory.create(sheet);
            newState[sheet.id] = record;
            shouldSaveChanges = true;
            break;
        }
    case Constants.EventTypes.REMOVE_SHEET_SUCCESS:
        {
            newState = omit(newState, sheet.id);
            shouldSaveChanges = true;
            break;
        }
    case Constants.ActionTypes.CLEAR_HISTORY:
        {
            newState = {};
            shouldSaveChanges = true;
            break;
        }
    }

    if (shouldSaveChanges) storage.setAll(newState);

    return newState;
}