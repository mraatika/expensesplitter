import {omit} from 'lodash';
import Constants from 'constants/appconstants';
import SheetHistoryFactory from 'factory/sheethistoryfactory';
import storageFactory from 'factory/storagefactory';

// create local storage
const storage = storageFactory(Constants.SHEET_STORE_NAME);

/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function sheetHistoryReducer(state = storage.getAll(), action) {
    let newState = state;
    let shouldSaveChanges = false;

    switch(action.type) {
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        {
            const {sheet} = action.payload.data;
            const record = SheetHistoryFactory.create(sheet);
            newState = {...state, [sheet.id]: record };
            shouldSaveChanges = true;
            break;
        }
    case Constants.EventTypes.REMOVE_SHEET_SUCCESS:
        {
            const {id} = action.payload.data;
            newState = omit(newState, id);
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