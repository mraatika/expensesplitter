import Constants from 'constants/appconstants';
import storageFactory from 'factory/storagefactory';

const storage = storageFactory(Constants.SETTINGS_STORE_NAME, { language: Constants.Languages.EN });
const initialState = storage.getAll();

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