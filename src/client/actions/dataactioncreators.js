import {isObject} from 'lodash';
import {t} from 'common/dictionary/dictionary';
import Constants from 'client/constants/appconstants';
import {InvalidArgumentsError} from 'client/util/errors.js';

/**
 *
 *
 *
 *  PUBLIC API
 *
 *
 *
 *
 *
 */

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
        type: Constants.ActionTypes.SET_SETTINGS,
        settings: settings
    };
}

/**
 * Clear sheet history
 * @return {Object}
 */
export function clearHistory() {
    return {
        type: Constants.ActionTypes.CLEAR_HISTORY
    };
}

/**
 * Remove a single sheet history entry from state and local db
 * @param  {Object} entry
 * @return {Object}
 */
export function removeSheetHistoryEntry(entry) {
    return {
        type: Constants.ActionTypes.REMOVE_SHEET_HISTORY_ENTRY,
        entry
    };
}

/**
 * Create sheet action
 * @param {Object} sheet
 * @return {Object}
 */
export function createSheet(sheet) {
    if (!isObject(sheet)) throw new InvalidArgumentsError('sheet is missing or invalid!');

    return {
        type: Constants.ActionTypes.CREATE_SHEET,
        sheet
    };
}

/**
 * Fetch sheet from the server
 * @param {string} sheetId
 * @return {Function}
 */
export function fetchSheet(sheetId) {
    if (!sheetId || typeof sheetId != 'string') throw new InvalidArgumentsError('sheet id is missing or invalid!');

    return (dispatch, getState) => {
        return dispatch({
            type: Constants.ActionTypes.LOAD_SHEET,
            payload: {
                request: {
                    url: `/sheet/${sheetId}`,
                    headers: { 'Accept-Language': getState().settings.language }
                }
            }
        });
    };
}

/**
 * Save sheet to the server
 * @param  {Object} sheet
 * @return {Function}
 */
export function saveSheet(sheet) {
    if (!isObject(sheet)) throw new InvalidArgumentsError('sheet is missing or invalid!');

    return (dispatch, getState) => {
        // no need to save if the sheet hasn't changed
        if (!getState().sheet.dirty) return;

        const isNew = !sheet.lastSavedOn;

        return dispatch({
            type: Constants.ActionTypes.SAVE_SHEET,
            payload: {
                request: {
                    method: isNew ? 'POST' : 'PUT',
                    url: `/sheet${isNew ? '' : `/${sheet.id}`}`,
                    data: { sheet },
                    headers: { 'Accept-Language': getState().settings.language }
                }
            }
        });
    };
}


/**
 * Update sheet
 * @param  {Object} sheet
 * @param  {Object} update
 * @return {Object}
 */
export function updateSheet(sheet, update = {}) {
    if (!isObject(sheet)) throw new InvalidArgumentsError('sheet missing or invalid!');

    return {
        type: Constants.ActionTypes.UPDATE_SHEET,
        sheet,
        update
    };
}

/**
 * Remove sheet
 * @param  {Object} sheet
 * @return {Function}
 */
export function removeSheet(sheet, adminKey) {
    if (!isObject(sheet)) throw new InvalidArgumentsError('sheet is missing or invalid!');

    return (dispatch, getState) => {

        // check if admin key is valid
        // if not then dispatch an error
        if (!adminKey || adminKey !== sheet.adminKey) {
            return dispatch({
                type: Constants.ErrorEventTypes.REMOVE_SHEET,
                error: {
                    client: true,
                    message: t('error.client.remove_sheet.admin_key')
                }
            });
        }

        return dispatch({
            type: Constants.ActionTypes.REMOVE_SHEET,
            payload: {
                request: {
                    method: 'DELETE',
                    url: `/sheet/${sheet.id}`,
                    headers: {
                        'Accept-Language': getState().settings.language,
                        'X-Admin-Token': adminKey
                    }
                }
            }
        });
    };
}