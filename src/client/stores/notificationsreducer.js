import React from 'react'; // eslint-disable-line no-unused-vars
import Constants from 'constants/appconstants';
import {t, tpl} from 'dictionary/dictionary';

/**
 * Server error event notification object
 * @private
 * @param  {string} errorType
 * @param {Object} error
 * @return {Object}
 */
function createServerErrorNotification(errorType, error) {
    const {status} = error.response;
    const {message} = error.response.data;

    return {
        title: t(`errors.${errorType}.title`) + '!',
        message,
        children: (<small>{tpl('error.server.status_code_info', { status })}</small>),
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