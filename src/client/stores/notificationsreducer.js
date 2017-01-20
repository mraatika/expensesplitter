import React from 'react'; // eslint-disable-line no-unused-vars
import {LOAD_SHEET_FAIL, REMOVE_SHEET_FAIL, SAVE_SHEET_FAIL} from 'client/stores/sheetreducer';
import {t, tpl} from 'common/dictionary/dictionary';

const _notificationDefaults = (errorType, message) => {
    // use the actual action type as translation key
    const translationKey = errorType.substring(errorType.lastIndexOf('/') + 1);
    return {
        title: t(`errors.${translationKey}.title`) + '!',
        message,
        level: 'error',
        autoDismiss: 15
    };
};

/**
 * Create an error notification object from a server error
 * @private
 * @param  {string} errorType
 * @param {Object} error
 * @return {Object}
 */
function createServerErrorNotification(errorType, error) {
    const response = error.response;
    let status = 0;
    let message = t('error.server.0');

    // if the server did not response then response is undefined
    if (response) {
        status = response.status;
        if (response.data) message = response.data.message;
    }

    return {
        ..._notificationDefaults(errorType, message),
        children: (<small>{tpl('error.server.status_code_info', { status })}</small>)
    };
}

/**
 * Create an error notification object from a client error
 * @param  {string} errorType
 * @param  {Object} error
 * @return {Object}
 */
function createClientErrorNotification(errorType, error) {
    return _notificationDefaults(errorType, error.message);
}

/**
 * Create an error notification (server or client)
 * @param  {Object} action
 * @return {Object}
 */
function createErrorNotification(action) {
    const {type, error} = action;
    return error.client ?
        createClientErrorNotification(type, error) :
        createServerErrorNotification(type, error);
}

/**
 * Notification reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export default function notificationsReducer(state = [], action) {
    switch(action.type) {
    case LOAD_SHEET_FAIL:
    case SAVE_SHEET_FAIL:
    case REMOVE_SHEET_FAIL:
        return state.concat(createErrorNotification(action));
    default:
        return state;
    }
}