import immutable from 'object-path-immutable';
import {ArrayUtils, isObject} from 'client/util/utils';
import {InvalidArgumentsError} from 'client/util/errors';
import expenseFactory from 'client/factory/expensefactory';
import {CREATE_SHEET, LOAD_SHEET_SUCCESS} from 'client/stores/sheetreducer';

/**
 * Event types
 */
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const REMOVE_EXPENSE = 'REMOVE_EXPENSE';


/**
 * Expenses reducer
 * @param  {Array} state
 * @param  {Object} action
 * @return {Object}
 */
export default function reducer(state = [], action) {
    switch(action.type) {
    case CREATE_SHEET:
        return [];
    case ADD_EXPENSE:
        return state.concat(action.expense);
    case REMOVE_EXPENSE:
        {
            const index = ArrayUtils.findIndexById(state, action.expense);
            return immutable.set(state, `${index}.removed`, true);
        }
    case LOAD_SHEET_SUCCESS:
        return [].concat(action.payload.data.sheet.expenses);
    default:
        return state;
    }
}

/**
 * Add an expense to sheet
 * @param  {Object} participant
 * @return {Object}
 */
export function addExpense(expense) {
    if (!isObject(expense)) throw new InvalidArgumentsError('expense missing or invalid!');

    return {
        type: ADD_EXPENSE,
        expense: expenseFactory(expense)
    };
}

/**
 * Remove expense from sheet
 * @param  {Object} participant
 * @return {Object}
 */
export function removeExpense(expense) {
    if (!isObject(expense)) throw new InvalidArgumentsError('expense missing or invalid!');

    return {
        type: REMOVE_EXPENSE,
        expense
    };
}