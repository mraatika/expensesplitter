import _ from 'lodash';
import DataStore from './datastore.js';
import Constants from '../constants/AppConstants';
import sheetFactory from '../factory/sheetfactory';
import expenseFactory from '../factory/expensefactory';
import participantFactory from '../factory/participantfactory';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';
import {String as StringUtils} from '../util/utils';

let sheetStore;

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
    let errors;

    if (!StringUtils.isNonEmptyString(sheetName)) throw new Error('IllegalArgumentsException: sheetName missing or invalid!');

    const sheet = Object.freeze(sheetFactory.create(sheetName));

    errors = validation.validate(sheet, Schema.Sheet);

    if (!_.isEmpty(errors)) {
        sheetStore.emitError(Constants.ErrorEventTypes.ADD_SHEET, errors);
        return;
    }

    sheetStore.storage.set(sheet.id, sheet);

    setActiveSheet(sheet.id);

    return sheet;
}

function removeSheet(sheetId) {
    let currentSheetId;

    if (!StringUtils.isNonEmptyString(sheetId)) throw new Error('IllegalArgumentsException: sheetId is missing or invalid!');

    currentSheetId = sheetStore.getCurrentSheetId();

    sheetStore.storage.remove(sheetId);

    if (sheetId === currentSheetId) {
        sheetStore.storage.remove('currentSheetId');
    }
}

function setActiveSheet(sheetId) {
    var currentSheetId;

    if (!StringUtils.isNonEmptyString(sheetId)) throw new Error('IllegalArgumentsException: sheetId is missing or invalid!');

    currentSheetId = sheetStore.getCurrentSheetId();

    if (currentSheetId === sheetId) return;

    sheetStore.storage.set('currentSheetId', sheetId);
}

function addParticipant(participantProperties) {
    var errors;

    if (!participantProperties) throw new Error('IllegalArgumentsException: participantProperties missing!');

    const participant = Object.freeze(participantFactory.create(participantProperties));

    errors = validation.validate(participant, Schema.Participant);

    if (!_.isEmpty(errors)) {
        sheetStore.emitError(Constants.ErrorEventTypes.ADD_PARTICIPANT, errors);
        return;
    }

    sheetStore.getCurrentSheet().participants.push(participant);
    return participant;
}

function removeParticipant(participantId) {
    var currentSheet = sheetStore.getCurrentSheet();
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
        sheetStore.emitError(Constants.ErrorEventTypes.ADD_EXPENSE, errors);
        return;
    }

    sheetStore.getCurrentSheet().expenses.push(expense);
    return expense;
}

function removeExpense(expenseId) {
    if (!expenseId) throw new Error('IllegalArgumentsException: expenseId missing!');
    findAndRemove(sheetStore.getCurrentSheet().expenses, expenseId);
}

function removeAllExpenses() {
    sheetStore.getCurrentSheet().expenses = [];
}

function saveCurrentSheet() {
    sheetStore.storage.set(sheetStore.getCurrentSheetId(), sheetStore.getCurrentSheet());
}

function setSettings(settings) {
    const sheet = sheetStore.getCurrentSheet();
    sheet.settings = settings;
    return sheet;
}

/**
 * @class SheetStore
 * @description Store for sheet objects
 * @extends {DataStore}
 */
class SheetStore extends DataStore {

    handleDispatcherEvent(payload) {
        const action = payload.action;

        switch(action.type) {
        case Constants.ActionTypes.CREATE_SHEET:
            if (addSheet(action.sheetName)) sheetStore.emitChange(Constants.EventTypes.ADD_SHEET_EVENT);
            break;
        case Constants.ActionTypes.REMOVE_SHEET:
            removeSheet(action.sheetId);
            sheetStore.emitChange(Constants.EventTypes.REMOVE_SHEET_EVENT);
            break;
        case Constants.ActionTypes.SET_ACTIVE_SHEET:
            setActiveSheet(action.sheetId);
            sheetStore.emitChange(Constants.EventTypes.SET_ACTIVE_SHEET_EVENT);
            break;
        case Constants.ActionTypes.ADD_PARTICIPANT:
            if (addParticipant(action.participant)) sheetStore.emitChange(Constants.EventTypes.ADD_PARTICIPANT_EVENT);
            break;
        case Constants.ActionTypes.REMOVE_PARTICIPANT:
            removeParticipant(action.participant.id);
            sheetStore.emitChange(Constants.EventTypes.REMOVE_PARTICIPANT_EVENT);
            break;
        case Constants.ActionTypes.ADD_EXPENSE:
            if (addExpense(action.expense)) sheetStore.emitChange(Constants.EventTypes.ADD_EXPENSE_EVENT);
            break;
        case Constants.ActionTypes.REMOVE_EXPENSE:
            removeExpense(action.expense.id);
            sheetStore.emitChange(Constants.EventTypes.REMOVE_EXPENSE_EVENT);
            break;
        case Constants.ActionTypes.REMOVE_ALL_EXPENSES:
            removeAllExpenses();
            sheetStore.emitChange(Constants.EventTypes.REMOVE_EXPENSE_EVENT);
            break;
        case Constants.ActionTypes.SET_SHEET_SETTINGS:
            setSettings(action.settings);
            sheetStore.emitChange(Constants.EventTypes.SETTINGS_CHANGED_EVENT);
            break;
        }
        // save made changes to storage
        saveCurrentSheet();
    }

    /**
     * Return all sheets from store
     * @return {array}
     */
    getSheets() {
        return _.chain(this.storage.getAll())
            .omit('currentSheetId')
            .toArray()
            .value();
    }

    /**
     * Return a single sheet from store
     * @param  {string} sheetId
     * @return {object}
     */
    getSheet(sheetId) {
        return this.storage.get(sheetId);
    }

    /**
     * Return current sheet from store
     * @return {object}
     */
    getCurrentSheet() {
        return this.getSheet(this.getCurrentSheetId());
    }

    /**
     * Return current sheet's id from store
     * @return {string}
     */
    getCurrentSheetId() {
        return this.storage.get('currentSheetId');
    }
}

// export an instance (singleton)
sheetStore = new SheetStore();

export default sheetStore;