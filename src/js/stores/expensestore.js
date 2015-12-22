import makeStore from 'makestore';
import _ from 'lodash';
import AppDispatcher from '../dispatchers/appdispatcher.js';
import Constants from '../constants/AppConstants.js';
import ParticipantStore from './participantstore.js';
import ExpenseFactory from '../factory/expensefactory.js';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';

// participant storage
let expenses = [];
// participant-sheet relation mapping
let sheetExpenseIndex = {};

const getExpense = expenseId => {
    return _.find(expenses, e => e.id == expenseId);
};

const getExpensesBySheetId = sheetId => {
    return _.filter(expenses, e => sheetExpenseIndex[e.id] == sheetId);
};

const addExpense = (expense, sheetId) => {
    const errors = validation.validate(expense, Schema.Expense);

    if (!_.isEmpty(errors)) return false;

    expenses.push(expense);
    sheetExpenseIndex[expense.id] = sheetId;

    return true;
};

const addExpenses = (expenses, sheetId) => {
    // return true if all adds succeeded
    return _.all(expenses.map(e => addExpense(e, sheetId)));
};

const removeExpense = expense => {
    if (!getExpense(expense.id)) return false;
    expenses = _.reject(expenses, e => e.id == expense.id);
    sheetExpenseIndex = _.omit(sheetExpenseIndex, expense.id);
    return true;
};

const removeAllExpenses = sheetId => {
    return _.some(_.map(getExpensesBySheetId(sheetId), removeExpense));
};

const removeExpensesByParticipant = participant => {
    // find all expenses of a participant
    const expensesOfParticipant = expenses.filter(e => {
        return e.payer === participant.id || e.participants.indexOf(participant.id) > -1;
    });

    return _.some(expensesOfParticipant.map(removeExpense));
};

/**
 * @class ExpenseStore
 * @description Store for expense models
 */
const ExpenseStore = makeStore({

    /**
     * Return expenses of a sheet or if omitted will return all expenses
     * @param  {string} [sheetId]
     * @return {array}
     */
    getExpenses(sheetId) {
        return sheetId ? getExpensesBySheetId(sheetId) : [];
    },

    /**
     * Get single expense model
     * @param  {string} expenseId
     * @return {Object}
     */
    getExpense(expenseId) {
        return getExpense(expenseId);
    },

    _emitChangeEvent() {
        ExpenseStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
    },

    /**
     * Dispatcher event listener. The only way to the store.
     * @param  {Object} payload
     */
    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;

        switch(action.type) {
        // ACTIONS:
        case Constants.ActionTypes.ADD_EXPENSE:
            const expense = ExpenseFactory.create(action.expense);

            if (!getExpense(expense.id)) {
                if (addExpense(expense, action.sheetId)) {
                    ExpenseStore._emitChangeEvent();
                } else {
                    ExpenseStore.emitChange(Constants.ErrorEventTypes.ADD_EXPENSE);
                }
            }
            break;
        case Constants.ActionTypes.REMOVE_EXPENSE:
            if (removeExpense(action.expense)) {
                ExpenseStore._emitChangeEvent();
            }
            break;
        case Constants.ActionTypes.REMOVE_ALL_EXPENSES:
            if (removeAllExpenses(action.sheetId)) {
                ExpenseStore._emitChangeEvent();
            }
            break;
        case Constants.ActionTypes.REMOVE_PARTICIPANT:
            if (removeExpensesByParticipant(action.participant)) {
                ExpenseStore._emitChangeEvent();
            }
            break;
        // EVENTS:
        case Constants.EventTypes.LOAD_SHEET_SUCCESS:
            // wait for participant store to add participant
            AppDispatcher.waitFor([ ParticipantStore.dispatcherIndex ]);

            if (addExpenses(action.sheet.expenses, action.sheet.id)) {
                ExpenseStore._emitChangeEvent();
            } else {
                ExpenseStore.emitChange(Constants.ErrorEventTypes.ADD_EXPENSE);
            }
            break;
        }
    })
});

export default ExpenseStore;