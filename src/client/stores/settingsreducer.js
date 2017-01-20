import Constants from 'client/constants/appconstants';
import storageFactory from 'client/factory/storagefactory';
import {isObject} from 'client/util/utils';
import {InvalidArgumentsError} from 'client/util/errors';

const storage = storageFactory(Constants.SETTINGS_STORE_NAME, { language: Constants.Languages.EN });

export const SET_SETTINGS = 'expensesplitter/settings/SET_SETTINGS';

/**
 * Sheet history reducers
 * @param  {Object} state Initially read from local storage
 * @param  {Object} action
 * @return {Object} Modified state
 */
export default function reducer(state = storage.getAll(), action) {
    switch(action.type) {
    case SET_SETTINGS:
        {
            const newState = { ...state, ...action.settings };
            storage.setAll(newState);
            return newState;
        }
    default:
        return state;
    }
}

/**
 * Set application settings
 * @param {Object} settings
 * @return {Object}
 */
export function setSettings(settings) {
    if (!isObject(settings)) {
        throw new InvalidArgumentsError('settings object is missing or invalid!');
    }

    return {
        type: SET_SETTINGS,
        settings: settings
    };
}