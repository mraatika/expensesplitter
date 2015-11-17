'use strict';

import _ from 'lodash';
import AppDispatcher from '../dispatchers/appdispatcher';
import {EventEmitter} from 'events';
import Constants from '../constants/AppConstants';
import sheetFactory from '../factory/sheetfactory';
import expenseFactory from '../factory/expensefactory';
import participantFactory from '../factory/participantfactory';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';
import {String as StringUtils} from '../util/utils';

// data storage entity
var dataStore = {};

function findAndRemove(collection, id) {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
            collection.splice(i, 1);
            return collection;
        }
    }

    throw new Error(`Unable to remove entity: Entity with id ${id} not found!`);
}

function addSheet(sheetName) {
    var errors;

    if (!StringUtils.isNonEmptyString(sheetName)) throw new Error('IllegalArgumentsException: sheetName missing or invalid!');

    const sheet = Object.freeze(sheetFactory.create(sheetName));

    errors = validation.validate(sheet, Schema.Sheet);

    if (!_.isEmpty(errors)) {
        dataStore.emitError(Constants.ErrorEventTypes.ADD_SHEET, errors);
        return;
    }

    dataStore.storage.set(sheet.id, sheet);

    setActiveSheet(sheet.id);

    return sheet;
}

function removeSheet(sheetId) {
    var currentSheetId;

    if (!StringUtils.isNonEmptyString(sheetId)) throw new Error('IllegalArgumentsException: sheetId is missing or invalid!');

    currentSheetId = dataStore.getCurrentSheetId();

    dataStore.storage.remove(sheetId);

    if (sheetId === currentSheetId) {
        dataStore.storage.remove('currentSheetId');
    }
}

function setActiveSheet(sheetId) {
    var currentSheetId;

    if (!StringUtils.isNonEmptyString(sheetId)) throw new Error('IllegalArgumentsException: sheetId is missing or invalid!');

    currentSheetId = dataStore.getCurrentSheetId();

    if (currentSheetId === sheetId) return;

    dataStore.storage.set('currentSheetId', sheetId);
}

function addParticipant(participantProperties) {
    var errors;

    if (!participantProperties) throw new Error('IllegalArgumentsException: participantProperties missing!');

    const participant = Object.freeze(participantFactory.create(participantProperties));

    errors = validation.validate(participant, Schema.Participant);

    if (!_.isEmpty(errors)) {
        dataStore.emitError(Constants.ErrorEventTypes.ADD_PARTICIPANT, errors);
        return;
    }

    dataStore.getCurrentSheet().participants.push(participant);
    return participant;
}

function removeParticipant(participantId) {
    var currentSheet = dataStore.getCurrentSheet();
    var expenses = _.filter(currentSheet.expenses, function(expense) {
        return expense.participants.indexOf(participantId) > -1 || expense.payer === participantId;
    });

    findAndRemove(currentSheet.participants, participantId);

    for (let i = 0, len = expenses.length; i < len; i++) {
        removeExpense(expenses[i].id);
    }
}

function addExpense(expenseProperties) {
    var errors;
    if (!expenseProperties) throw new Error('IllegalArgumentsException: expenseProperties are missing!');
    const expense = Object.freeze(expenseFactory.create(expenseProperties));

    errors = validation.validate(expense, Schema.Expense);

    if (!_.isEmpty(errors)) {
        dataStore.emitError(Constants.ErrorEventTypes.ADD_EXPENSE, errors);
        return;
    }

    dataStore.getCurrentSheet().expenses.push(expense);
    return expense;
}

function removeExpense(expenseId) {
    if (!expenseId) throw new Error('IllegalArgumentsException: expenseId missing!');
    findAndRemove(dataStore.getCurrentSheet().expenses, expenseId);
}

function removeAllExpenses() {
    dataStore.getCurrentSheet().expenses = [];
}

function saveCurrentSheet() {
    dataStore.storage.set(dataStore.getCurrentSheetId(), dataStore.getCurrentSheet());
}

var handleDispatcherEvent = function(payload) {
    var action = payload.action;

    switch(action.type) {

    case Constants.ActionTypes.CREATE_SHEET:
        {
            let sheet = addSheet(action.sheetName);
            if (sheet) {
                dataStore.emitChange(Constants.EventTypes.ADD_SHEET_EVENT);
            }
        }

        break;

    case Constants.ActionTypes.REMOVE_SHEET:
        removeSheet(action.sheetId);
        dataStore.emitChange(Constants.EventTypes.REMOVE_SHEET_EVENT);

        break;

    case Constants.ActionTypes.SET_ACTIVE_SHEET:
        setActiveSheet(action.sheetId);
        dataStore.emitChange(Constants.EventTypes.SET_ACTIVE_SHEET_EVENT);

        break;

    case Constants.ActionTypes.ADD_PARTICIPANT:
        {
            let participant = addParticipant(action.participant);
            if (participant) {
                dataStore.emitChange(Constants.EventTypes.ADD_PARTICIPANT_EVENT);
            }
        }

        break;

    case Constants.ActionTypes.REMOVE_PARTICIPANT:
        {
            let participant = action.participant;
            removeParticipant(participant.id);
            dataStore.emitChange(Constants.EventTypes.REMOVE_PARTICIPANT_EVENT);
        }

        break;

    case Constants.ActionTypes.ADD_EXPENSE:
        {
            let expense = addExpense(action.expense);
            if (expense) {
                dataStore.emitChange(Constants.EventTypes.ADD_EXPENSE_EVENT);
            }
        }

        break;

    case Constants.ActionTypes.REMOVE_EXPENSE:
        {
            let expense = action.expense;
            removeExpense(expense.id);
            dataStore.emitChange(Constants.EventTypes.REMOVE_EXPENSE_EVENT);
        }

        break;

    case Constants.ActionTypes.REMOVE_ALL_EXPENSES:
        {
            removeAllExpenses();
            dataStore.emitChange(Constants.EventTypes.REMOVE_EXPENSE_EVENT);
        }

        break;
    }

    // save made changes to storage
    saveCurrentSheet();
};

/**
 * Actial dataStore's public API
 * @type {Object}
 * @extends {EventEmitter}
 */
class DataStore extends EventEmitter {

    init(storage) {
        this.storage = storage;

        if (!this.dispatcherIndex) {
            // register store with dispatcher, allowing actions to flow through
            this.dispatcherIndex = AppDispatcher.register(handleDispatcherEvent);
        }
    }

    getSheets() {
        return _.chain(this.storage.getAll())
            .omit('currentSheetId')
            .toArray()
            .value();
    }

    getCurrentSheet() {
        return this.storage.get(this.getCurrentSheetId());
    }

    getCurrentSheetId() {
        return this.storage.get('currentSheetId');
    }

    // Allow Controller-View to register itself with store
    addChangeListener(callback) {
        this.on(Constants.EventTypes.CHANGE_EVENT, callback);
    }

    addErrorListener(callback) {
        this.on(Constants.ErrorEventTypes.ERROR_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(Constants.EventTypes.CHANGE_EVENT, callback);
    }

    removeErrorListener(callback) {
        this.removeListener(Constants.ErrorEventTypes.ERROR_EVENT, callback);
    }
    /**
     * Triggers change listeners, firing controller-view callback
     * @param  {String} eventType
     * @event Constants.CHANGE_EVENT
     */
    emitChange(eventType) {
        this.emit(Constants.EventTypes.CHANGE_EVENT, eventType);
    }

    /**
     * Emits an error event firing error callbacks on listeners
     * @param   {String} eventType
     * @param   {Object} errors
     */
    emitError(eventType, errors) {
        this.emit(Constants.ErrorEventTypes.ERROR_EVENT, eventType, errors);
    }

}

dataStore = new DataStore();

export default dataStore;
