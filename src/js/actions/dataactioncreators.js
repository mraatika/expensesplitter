'use strict';

import AppDispatcher from '../dispatchers/appdispatcher';
import Constants from '../constants/AppConstants';

export default {

// sheet

    addSheet: function(sheetName) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.CREATE_SHEET,
            sheetName: sheetName
        });
    },

    removeSheet: function(sheetId) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_SHEET,
            sheetId: sheetId
        });
    },

    setActiveSheet: function(sheetId) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_ACTIVE_SHEET,
            sheetId: sheetId
        });
    },

// participants

    addParticipant: function(participant) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.ADD_PARTICIPANT,
            participant: participant
        });
    },

    removeParticipant: function(participant) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_PARTICIPANT,
            participant: participant
        });
    },

// expenses

    addExpense: function(expense) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.ADD_EXPENSE,
            expense: expense
        });
    },

    removeExpense: function(expense) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REMOVE_EXPENSE,
            expense: expense
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
            type: Constants.ActionTypes.SET_SETTINGS,
            settings: settings
        });
    },

    setLanguage: function(langCode) {
        AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.SET_LANGUAGE,
            language: langCode
        });
    }
};