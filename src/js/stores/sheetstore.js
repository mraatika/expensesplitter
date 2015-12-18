import _ from 'lodash';
import makeStore from 'makestore';
import AppDispatcher from '../dispatchers/appdispatcher';
import ExpenseStore from './expensestore.js';
import Constants from '../constants/AppConstants';
import sheetFactory from '../factory/sheetfactory';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';
import {ValidationError} from '../util/errors.js';

let currentSheetId;
let sheets = {};

function addSheet(sheet) {
    const errors = validation.validate(sheet, Schema.Sheet);

    if (!_.isEmpty(errors)) {
        throw new ValidationError('Sheet adding failed', errors);
    }

    sheets[sheet.id] = sheet;

    setActiveSheet(sheet.id);
}

function removeSheet(sheet) {
    const sheetId = sheet.id;

    sheets = _.omit(sheets, sheet);

    if (sheetId === currentSheetId) {
        currentSheetId = null;
    }
}

function setActiveSheet(sheetId) {
    if (currentSheetId === sheetId) return;
    currentSheetId = sheetId;
}

function saveSheet(sheet) {
    if (sheet) sheets[sheet.id] = sheet;
}

function setSettings(settings) {
    let sheet = sheets[currentSheetId];
    sheet.settings = settings;
    return sheet;
}

function restoreSheet(sheet) {
    addSheet(sheet);
}

/**
 * @class SheetStore
 * @description Store for sheet objects
 * @extends {DataStore}
 */
const sheetStore = makeStore({

    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;

        switch(action.type) {
    // ACTIONS
        case Constants.ActionTypes.CREATE_SHEET:
            try {
                const sheet = sheetFactory.create(action.sheet);
                addSheet(sheet);
                sheetStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
            } catch(e) {
                sheetStore.emitChange(Constants.ErrorEventTypes.ADD_SHEET);
            }
            break;
        case Constants.ActionTypes.REMOVE_SHEET:
            removeSheet(action.sheet);
            sheetStore.emitChange(Constants.EventTypes.REMOVE_SHEET_EVENT);
            break;
        case Constants.ActionTypes.SET_ACTIVE_SHEET:
            setActiveSheet(action.sheetId);
            sheetStore.emitChange(Constants.EventTypes.SET_ACTIVE_SHEET_EVENT);
            break;
        case Constants.ActionTypes.SET_SHEET_SETTINGS:
            setSettings(action.settings);
            sheetStore.emitChange(Constants.EventTypes.SETTINGS_CHANGED_EVENT);
            break;
    // EVENTS:
        case Constants.EventTypes.SAVE_SHEET_SUCCESS:
            saveSheet(_.omit(sheets[action.sheetId], '_isNew'));
            sheetStore.emitChange(Constants.EventTypes.SAVE_SHEET_SUCCESS);
            break;
        case Constants.EventTypes.LOAD_SHEET_SUCCESS:
            try {
                addSheet(action.sheet);
                AppDispatcher.waitFor([ ExpenseStore.dispatcherIndex ]);
                sheetStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
            } catch(e) {
                sheetStore.emitError(Constants.ErrorEventTypes.ADD_SHEET);
            }
            break;
    // ERRORS
        case Constants.ErrorEventTypes.SAVE_SHEET:
            sheetStore.emitChange(Constants.EventTypes.ERROR_EVENT);
            break;
        case Constants.ErrorEventTypes.REMOVE_SHEET:
            restoreSheet(action.sheet);
            sheetStore.emitChange(Constants.EventTypes.SET_ACTIVE_SHEET_EVENT);
            break;
        case Constants.ErrorEventTypes.LOAD_SHEET:
            sheetStore.emitChange(Constants.ErrorEventTypes.LOAD_SHEET);
            break;
        }
        // save made changes to storage
        saveSheet(sheetStore.getCurrentSheet());
    }),

    /**
     * Return all sheets from store
     * @return {array}
     */
    getSheets() {
        return _.chain(sheets)
            .omit('currentSheetId')
            .toArray()
            .value();
    },

    /**
     * Return a single sheet from store
     * @param  {string} sheetId
     * @return {object}
     */
    getSheet(sheetId) {
        return sheets[sheetId];
    },

    /**
     * Return current sheet from store
     * @return {object}
     */
    getCurrentSheet() {
        return this.getSheet(currentSheetId);
    }
});

export default sheetStore;