import Constants from 'client/constants/appconstants';
import storageFactory from 'client/factory/storagefactory';

const storage = storageFactory(Constants.SETTINGS_STORE_NAME, { language: Constants.Languages.EN });

/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function settingsReducer(state = storage.getAll(), action) {
    switch(action.type) {
    case Constants.ActionTypes.SET_SETTINGS:
        {
            const newState = { ...state, ...action.settings };
            storage.setAll(newState);
            return newState;
        }
    default:
        return state;
    }
}