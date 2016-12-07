import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import {ArrayUtils} from 'client/util/utils';
import expenseFactory from 'client/factory/expensefactory';

/**
 * Expenses reducer
 * @param  {Array} state
 * @param  {Object} action
 * @return {Object}
 */
export function expensesReducer(state = [], action) {
    switch(action.type) {
    case Constants.ActionTypes.CREATE_SHEET:
        return [];
    case Constants.ActionTypes.ADD_EXPENSE:
        return state.concat(expenseFactory(action.expense));
    case Constants.ActionTypes.REMOVE_EXPENSE:
        {
            const index = ArrayUtils.findIndexById(state, action.expense);
            return immutable.set(state, `${index}.removed`, true);
        }
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return [].concat(action.payload.data.sheet.expenses);
    default:
        return state;
    }
}