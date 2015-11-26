import Constants from '../constants/AppConstants';
import DataStore from './datastore.js';

let settingsStore;

function setLanguage(langCode) {
    settingsStore.storage.set('language', langCode);
}

/**
 * @class SettingsStore
 * @description Store for app wide settings
 * @extends {DataStore}
 */
class SettingsStore extends DataStore {

    /**
     * Return settings
     * @return {object} settings
     */
    getSettings() {
        return this.storage.getAll();
    }

    handleDispatcherEvent(payload) {
        const action = payload.action;

        switch(action.type) {
        case Constants.ActionTypes.SET_LANGUAGE:
            setLanguage(action.language);
            settingsStore.emitChange(Constants.EventTypes.LANGUAGE_CHANGED_EVENT);
            break;
        }
    }
}

settingsStore = new SettingsStore();

export default settingsStore;

