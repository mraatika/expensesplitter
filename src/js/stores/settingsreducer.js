import Constants from 'constants/appconstants';
import languages from 'dictionary/languages';
import storageFactory from 'factory/storagefactory';

const storage = storageFactory.create(Constants.SETTINGS_STORE_NAME);
const initialState = Object.assign({ language: languages.en }, storage.getAll());
/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export function settings(state = initialState, action) {
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