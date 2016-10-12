import {isEmpty, isObject, map} from 'lodash';
import {push} from 'react-router-redux';
import Constants from '../constants/appconstants';
import {t} from 'dictionary/dictionary';
import SheetService from '../service/sheetservice.js';
import {StringUtils} from '../util/utils';
import {InvalidArgumentsError} from '../util/errors.js';
import validation from '../validation/validation';
import {Sheet as SheetScema} from '../validation/schema/schema';


/**
 * Pre fetch action
 * @private
 * @param  {string} sheetId
 * @return {Object}
 */
function requestSheet(sheetId) {
    if (!StringUtils.isNonEmptyString(sheetId)) {
        throw new InvalidArgumentsError('sheetId missing or invalid!');
    }

    return {
        type: Constants.ActionTypes.REQUEST_SHEET,
        sheetId: sheetId
    };
}

/**
 * Pre save action
 * @private
 * @param  {Object} sheet
 * @return {Object}
 */
function requestSaveSheet(sheet) {
    return {
        type: Constants.ActionTypes.SAVE_SHEET,
        sheet
    };
}

/**
 * Sheet load success event
 * @private
 * @param  {string} sheetId
 * @param  {Object} response Server's response
 * @return {Object}
 */
function sheetReceived(sheetId, response) {
    return {
        type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
        sheetId,
        sheet: response.data.sheet,
        receivedAt: new Date()
    };
}

/**
 * Sheet save success event
 * @private
 * @param  {Object} sheet
 * @return {Object}
 */
function saveSheetSucceeded(sheet) {
    return {
        type: Constants.EventTypes.SAVE_SHEET_SUCCESS,
        sheet
    };
}

/**
 * Sheet remove success event
 * @private
 * @param  {Object} sheet
 * @return {Object}
 */
function sheetRemoved(sheet) {
    return {
        type: Constants.EventTypes.REMOVE_SHEET_SUCCESS,
        sheet
    };
}

/**
 * Server error event
 * @private
 * @param  {string} errorType
 * @param {Object} error
 * @return {Object}
 */
function createServerError(errorType, error) {
    const {statusText, status} = error;

    return {
        type: errorType,
        error: {
            title: t(`errors.${errorType}.title`) + '!',
            message: `${statusText} (${status})`,
            level: 'error',
            autoDismiss: 15
        }
    };
}

/**
 * User error event (e.g validation error)
 * @private
 * @param  {string} errorType
 * @param {string} description
 * @return {Object}
 */
function createUserError(errorType, description) {
    return {
        type: errorType,
        error: {
            title: t(`errors.${errorType}.title`) + '!',
            message: description,
            level: 'error',
            autoDismiss: 15
        }
    };
}

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
 * Fetch sheet from the server
 * @param {string} sheetId
 * @return {Function}
 */
export function fetchSheet(sheetId) {
    return dispatch => {

        dispatch(requestSheet(sheetId));

        return new SheetService().getSheet(sheetId)
            .then(result => dispatch(sheetReceived(sheetId, result)))
            .fail(error => {
                console.error(error);
                dispatch(createServerError(Constants.ErrorEventTypes.LOAD_SHEET, error));
                dispatch(push('/'));
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

        dispatch(requestSaveSheet(sheet));

        const errors = validation.validate(sheet, SheetScema);

        if (!isEmpty(errors)) {
            const errorDescription = map(errors, (value, key) => `${key}: ${value}`).join(', ');
            dispatch(createUserError(Constants.ErrorEventTypes.ADD_SHEET, errorDescription));
            return;
        }

        return new SheetService().saveSheet(sheet)
            .then(result => {
                dispatch(saveSheetSucceeded(result.data.sheet));
            })
            .fail(error => {
                console.error(error);
                dispatch(createServerError(Constants.ErrorEventTypes.SAVE_SHEET, error));
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

    return dispatch => {
        return new SheetService().removeSheet(sheet)
            .then(() => dispatch(sheetRemoved(sheet)))
            .fail(error => {
                console.error(error);
                dispatch(createServerError(Constants.ErrorEventTypes.REMOVE_SHEET, error));
            });
    };
}