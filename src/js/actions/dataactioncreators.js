import {isObject} from 'lodash';
import Constants from '../constants/appconstants';
import {InvalidArgumentsError} from '../util/errors.js';

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
 * Fetch sheet from the server
 * @param {string} sheetId
 * @return {Function}
 */
export function fetchSheet(sheetId) {
    return {
        type: Constants.ActionTypes.LOAD_SHEET,
        payload: {
            request: {
                url: `/sheet/${sheetId}`
            }
        }
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
                    url: `/sheet/${isNew ? '' : sheet.id}`,
                    data: { sheet }
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
    if (!sheet) throw new InvalidArgumentsError('sheet missing or invalid!');

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
export function removeSheet(sheet) {
    if (!isObject(sheet)) throw new InvalidArgumentsError('sheet is missing or invalid!');

    return {
        type: Constants.ActionTypes.REMOVE_SHEET,
        payload: {
            request: {
                method: 'DELETE',
                url: `/sheet/${sheet.id}`
            }
        }
    };
}