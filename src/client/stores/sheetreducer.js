import immutable from 'object-path-immutable';
import sheetFactory from 'client/factory/sheetfactory';
import {t} from 'common/dictionary/dictionary';
import {isObject} from 'client/util/utils';
import {InvalidArgumentsError} from 'client/util/errors';
import {ADD_EXPENSE, REMOVE_EXPENSE} from 'client/stores/expensesreducer';
import {ADD_PARTICIPANT, REMOVE_PARTICIPANT} from 'client/stores/participantsreducer';

/**
 * Action, error and event types
 */
export const CREATE_SHEET           = 'expensesplitter/sheet/CREATE_SHEET';
export const LOAD_SHEET             = 'expensesplitter/sheet/LOAD_SHEET';
export const REMOVE_SHEET           = 'expensesplitter/sheet/REMOVE_SHEET';
export const SAVE_SHEET             = 'expensesplitter/sheet/SAVE_SHEET';
export const UPDATE_SHEET           = 'expensesplitter/sheet/UPDATE_SHEET';

export const ADD_SHEET_FAIL         = 'expensesplitter/sheet/ADD_SHEET_FAIL';
export const LOAD_SHEET_FAIL        = 'expensesplitter/sheet/LOAD_SHEET_FAIL';
export const SAVE_SHEET_FAIL        = 'expensesplitter/sheet/SAVE_SHEET_FAIL';
export const REMOVE_SHEET_FAIL      = 'expensesplitter/sheet/REMOVE_SHEET_FAIL';

export const LOAD_SHEET_SUCCESS     = 'expensesplitter/sheet/LOAD_SHEET_SUCCESS';
export const SAVE_SHEET_SUCCESS     = 'expensesplitter/sheet/SAVE_SHEET_SUCCESS';
export const REMOVE_SHEET_SUCCESS   = 'expensesplitter/sheet/REMOVE_SHEET_SUCCESS';

/**
 * Store's initial state
 * @type {Object}
 */
const initialState = { dirty: false };

/**
 * Sheet related reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export default function reducer(state = initialState, action) {

    switch(action.type) {
    // ACTIONS
    case CREATE_SHEET:
        return {... state, ...action.sheet, dirty: true };
    case ADD_EXPENSE:
    case REMOVE_EXPENSE:
    case ADD_PARTICIPANT:
    case REMOVE_PARTICIPANT:
        return { ...state, dirty: true };
    case UPDATE_SHEET:
        return { ...state, ...action.update, dirty: true };
    // EVENTS
    case LOAD_SHEET_SUCCESS:
    case SAVE_SHEET_SUCCESS:
        return {...state, ...action.payload.data.sheet, dirty: false };
    // ERRORS
    case SAVE_SHEET_FAIL:
        if (!state.dirty) {
            return immutable.set(state, 'dirty', true);
        }
    }

    return state;
}

/**
 * Create sheet action
 * @param {Object} sheet
 * @return {Object}
 */
export function createSheet(sheet) {
    if (!isObject(sheet)) throw new InvalidArgumentsError('sheet is missing or invalid!');

    return {
        type: CREATE_SHEET,
        sheet: sheetFactory(sheet)
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
            type: LOAD_SHEET,
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
        if (!sheet.dirty) return;

        const {expenses, participants, settings} = getState();
        const isNew = !sheet.lastSavedOn;

        const updateObject = { ...sheet, expenses, participants };
        delete updateObject.dirty;

        return dispatch({
            type: SAVE_SHEET,
            payload: {
                request: {
                    method: isNew ? 'POST' : 'PUT',
                    url: `/sheet${isNew ? '' : `/${updateObject.id}`}`,
                    data: { sheet: updateObject },
                    headers: { 'Accept-Language': settings.language }
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
        type: UPDATE_SHEET,
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
                type: REMOVE_SHEET_FAIL,
                error: {
                    client: true,
                    message: t('error.client.remove_sheet.admin_key')
                }
            });
        }

        return dispatch({
            type: REMOVE_SHEET,
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