import makeStore from 'makestore';
import _ from 'lodash';
import AppDispatcher from '../dispatchers/appdispatcher';
import Constants from '../constants/AppConstants.js';
import ExpenseFactory from '../factory/expensefactory.js';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';
import {ValidationError} from '../util/errors.js';

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
    let errors;

    if (!getExpense(expense.id)) {
        errors = validation.validate(expense, Schema.Expense);

        if (!_.isEmpty(errors)) {
            throw new ValidationError('Participant validation failed', errors);
        }

        expenses.push(expense);
        sheetExpenseIndex[expense.id] = sheetId;

        return true;
    }

    return false;
};

const removeExpense = expense => {
    expenses = _.reject(expenses, e => e.id == expense.id);
    sheetExpenseIndex = _.omit(sheetExpenseIndex, expense.id);
};

const removeAllExpenses = sheetId => {
    expenses = _.reject(expenses, e => sheetExpenseIndex[e.id] == sheetId);
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
        return sheetId ? getExpensesBySheetId(sheetId) : _.clone(expenses);
    },

    /**
     * Get single expense model
     * @param  {string} expenseId
     * @return {Object}
     */
    getExpense(expenseId) {
        return getExpense(expenseId);
    },

    /**
     * Dispatcher event listener. The only way to the store.
     * @param  {Object} payload
     */
    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;
        let shouldEmitChangeEvent = false;

        switch(action.type) {
        case Constants.ActionTypes.ADD_EXPENSE:
            try {
                const expense = ExpenseFactory.create(action.expense);
                shouldEmitChangeEvent = addExpense(expense, action.sheetId);
            } catch(err) {
                ExpenseStore.emitChange(Constants.ErrorEventTypes.ADD_EXPENSE);
            }
            break;
        case Constants.ActionTypes.REMOVE_EXPENSE:
            removeExpense(action.expense);
            shouldEmitChangeEvent = true;
            break;
        case Constants.ActionTypes.REMOVE_ALL_EXPENSES:
            removeAllExpenses(action.sheetId);
            shouldEmitChangeEvent = true;
            break;
        }

        if (shouldEmitChangeEvent) {
            ExpenseStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
        }
    })
});

export default ExpenseStore;