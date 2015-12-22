import _ from 'lodash';
import AppDispatcher from '../dispatchers/appdispatcher';
import Constants from '../constants/AppConstants';
import SheetStore from '../stores/sheetstore.js';
import SheetService from '../service/sheetservice.js';
import {StringUtils} from '../util/utils';
import {InvalidArgumentsError} from '../util/errors.js';

export default {

// sheet

    /**
     * Create and add sheet locally to the store
     * @param {Object} sheet Initial members
     */
    createSheet: function(sheet) {
        if (!sheet || !_.isObject(sheet)) {
            throw new InvalidArgumentsError('sheet missing or invalid!');
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.CREATE_SHEET,
            sheet
        });
    },

    /**
     * Remove sheet from the server and the store
     * @param  {Object} sheet
     */
    removeSheet: function(sheet) {
        if (!sheet || !sheet.id) {
            throw new InvalidArgumentsError('sheet or sheet\' id is missing or invalid!');
        }

        // if the sheet is not yet saved to the server then
        // skip the ajax call
        if (!sheet._isNew) {
            new SheetService().removeSheet(sheet)
                .then(() => {
                    AppDispatcher.handleServerAction({
                        type: Constants.EventTypes.REMOVE_SHEET_SUCCESS
                    });
                })
                .fail(error => {
                    AppDispatcher.handleServerAction({
                        type: Constants.ErrorEventTypes.REMOVE_SHEET,
                        error, sheet
                    });
                });
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_SHEET,
            sheet
        });
    },

    /**
     * Load sheet from the server or the local store if present
     * @param  {string} sheetId
     * @return {undefined}
     */
    loadSheet: function(sheetId) {
        if (!StringUtils.isNonEmptyString(sheetId)) {
            throw new InvalidArgumentsError('sheetId missing or invalid!');
        }

        const sheet = SheetStore.getSheet(sheetId);

        // return from sheet store if already loaded
        if (sheet) {
            AppDispatcher.handleServerAction({
                type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
                sheet: sheet
            });
            return;
        }

        // if not found in store then fetch it from the server
        new SheetService().getSheet(sheetId)
            .then(response => {
                AppDispatcher.handleServerAction({
                    type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
                    sheet: response.data.sheet
                });
            })
            .fail(error => {
                AppDispatcher.handleServerAction({
                    type: Constants.ErrorEventTypes.LOAD_SHEET,
                    error
                });
            });

    },

    /**
     * Set active sheet
     * @param {string} sheetId
     */
    setActiveSheet: function(sheetId) {
        if (!StringUtils.isNonEmptyString(sheetId)) {
            throw new InvalidArgumentsError('sheetId is missing or invalid!');
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_ACTIVE_SHEET,
            sheetId
        });
    },

    /**
     * Save sheet to the server
     * @param  {Object} sheet
     */
    saveSheet: function(sheet) {
        if (!sheet || !sheet.id) {
            throw new InvalidArgumentsError('sheet or sheet\'s id is missing or invalid!');
        }

        new SheetService().saveSheet(sheet)
            .then(response => {
                AppDispatcher.handleServerAction({
                    type: Constants.EventTypes.SAVE_SHEET_SUCCESS,
                    sheetId: response.data.sheetId
                });
            })
            .fail(error => {
                AppDispatcher.handleServerAction({
                    type: Constants.ErrorEventTypes.SAVE_SHEET,
                    error
                });
            });
    },

// participants

    addParticipant: function(participant, sheetId) {
        if (!participant || !sheetId) {
            throw new InvalidArgumentsError('participant or sheetId is missing or invalid!');
        }

        AppDispatcher.handleServerAction({
            type: Constants.ActionTypes.ADD_PARTICIPANT,
            participant,
            sheetId
        });
    },

    removeParticipant: function(participant) {
        if (!participant) {
            throw new InvalidArgumentsError('participant is missing or invalid!');
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_PARTICIPANT,
            participant
        });
    },

// expenses

    addExpense: function(expense, sheetId) {
        if (!expense || !sheetId) {
            throw new InvalidArgumentsError('expense or sheetId is missing or invalid!');
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.ADD_EXPENSE,
            expense,
            sheetId
        });
    },

    removeExpense: function(expense) {
        if (!expense) {
            throw new InvalidArgumentsError('expense is missing or invalid!');
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_EXPENSE,
            expense
        });
    },

    removeAllExpenses: function(sheetId) {
        if (!sheetId) {
            throw new InvalidArgumentsError('sheetId is missing or invalid!');
        }

        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_ALL_EXPENSES,
            sheetId
        });
    },

// settings

    setSettings: function (settings) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_SHEET_SETTINGS,
            settings
        });
    },

    setLanguage: function(langCode) {
        if (!langCode) {
            throw new InvalidArgumentsError('langCode is missing or invalid!');
        }
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_LANGUAGE,
            language: langCode
        });
    }
};