import AppDispatcher from '../dispatchers/appdispatcher';
import Constants from '../constants/AppConstants';

export default {

// sheet

    addSheet: function(sheetName) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.CREATE_SHEET,
            sheetName
        });
    },

    removeSheet: function(sheet) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_SHEET,
            sheet
        });
    },

    setActiveSheet: function(sheetId) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_ACTIVE_SHEET,
            sheetId
        });
    },

    updateSheet: function(sheet) {
        AppDispatcher.handleServerAction({
            type: Constants.ActionTypes.UPDATE_SHEET,
            sheet
        });
    },

    saveSheet: function(sheet) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SAVE_SHEET,
            sheet
        });
    },

// participants

    addParticipant: function(participant) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.ADD_PARTICIPANT,
            participant
        });
    },

    removeParticipant: function(participant) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_PARTICIPANT,
            participant
        });
    },

// expenses

    addExpense: function(expense) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.ADD_EXPENSE,
            expense
        });
    },

    removeExpense: function(expense) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_EXPENSE,
            expense
        });
    },

    removeAllExpenses: function() {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_ALL_EXPENSES
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
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_LANGUAGE,
            language: langCode
        });
    }
};