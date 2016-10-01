import _ from 'lodash';
import makeStore from 'makestore';
import Constants from '../constants/appconstants';
import storageFactory from '../factory/storagefactory';
import AppDispatcher from '../dispatchers/appdispatcher';
import SheetHistoryFactory from '../factory/sheethistoryfactory';
import SheetStore from './sheetstore';

// create local storage
const storage = storageFactory.create(Constants.SHEET_STORE_NAME);

const addToHistory = sheet => {
    if (!storage.get(sheet.id)) {
        storage.set(sheet.id, SheetHistoryFactory.create(sheet));
    }
};

const removeFromHistory = sheet => {
    if (storage.get(sheet.id)) {
        storage.remove(sheet.id);
    }
};

const clearHistory = () => {
    storage.clear();
};

/**
 * @class sheetHistoryStore
 * @description Store for history of loaded / created sheets
 */
const sheetHistoryStore = makeStore({
    /**
     * Return all history
     * @return {object} settings
     */
    getHistory() {
        return _.toArray(storage.getAll());
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;

        switch(action.type) {
        case Constants.EventTypes.SAVE_SHEET_SUCCESS:
            addToHistory(SheetStore.getSheet(action.sheetId));
            break;
        case Constants.EventTypes.REMOVE_SHEET_SUCCESS:
            removeFromHistory(action.sheet);
            break;
        case Constants.EventTypes.LOAD_SHEET_SUCCESS:
            addToHistory(action.sheet);
            break;
        case Constants.ActionTypes.CLEAR_HISTORY:
            clearHistory();
            break;
        }

        sheetHistoryStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
    })
});

export default sheetHistoryStore;

