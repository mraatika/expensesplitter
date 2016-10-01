import makeStore from 'makestore';
import Constants from '../constants/appconstants';
import storageFactory from '../factory/storagefactory';
import AppDispatcher from '../dispatchers/appdispatcher';

const storage = storageFactory.create(Constants.SETTINGS_STORE_NAME);

function setLanguage(langCode) {
    storage.set('language', langCode);
}

/**
 * @class SettingsStore
 * @description Store for app wide settings
 */
const settingsStore = makeStore({

    /**
     * Return settings
     * @return {object} settings
     */
    getSettings() {
        return storage.getAll();
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;

        switch(action.type) {
        case Constants.ActionTypes.SET_LANGUAGE:
            setLanguage(action.language);
            settingsStore.emitChange(Constants.EventTypes.LANGUAGE_CHANGED_EVENT);
            break;
        }
    })
});

export default settingsStore;

