import {without} from 'lodash';
import {connect} from 'react-redux';
import expenseFactory from 'factory/expensefactory';
import ExpensesPage from 'components/expenses/expensespage.jsx';
import {updateSheet} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet} = state.sheet;
    return { sheet, settings: state.settings };
}

function mapDispatchToProps(dispatch) {

    return {
        addExpense: (sheet, expenseProperties) => {
            const expense = expenseFactory(expenseProperties);

            dispatch(updateSheet(sheet, {
                expenses: sheet.expenses.concat([ expense ])
            }));
        },

        removeExpenses: (sheet, expenses) => {
            const asArray = [].concat(expenses);

            dispatch(updateSheet(sheet, {
                expenses: without(sheet.expenses, ...asArray)
            }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);