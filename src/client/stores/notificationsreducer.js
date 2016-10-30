import Constants from 'constants/appconstants';
import {t} from 'dictionary/dictionary';

/**
 * Server error event notification object
 * @private
 * @param  {string} errorType
 * @param {Object} error
 * @return {Object}
 */
function createServerErrorNotification(errorType, error) {
    const {statusText, status} = error.response;

    return {
        title: t(`errors.${errorType}.title`) + '!',
        message: `${statusText} (${status})`,
        level: 'error',
        autoDismiss: 15
    };
}

/**
 * Notification reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function notificationsReducer(state = [], action) {
    switch(action.type) {
    case Constants.ErrorEventTypes.LOAD_SHEET:
    case Constants.ErrorEventTypes.SAVE_SHEET:
    case Constants.ErrorEventTypes.REMOVE_SHEET:
        return state.concat(createServerErrorNotification(action.type, action.error));
    default:
        return state;
    }
}