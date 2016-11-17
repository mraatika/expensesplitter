import {connect} from 'react-redux';
import ExpensesPage from 'client/components/expenses/expensespage.jsx';
import {addExpense, removeExpense} from 'client/actions/dataactioncreators';
import {ArrayUtils} from 'client/util/utils';

function mapStateToProps(state) {
    const {sheet} = state.sheet;

    return {
        sheet,
        participants: ArrayUtils.rejectRemoved(sheet.participants),
        expenses: ArrayUtils.rejectRemoved(sheet.expenses),
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {

    return {
        addExpense: expenseProperties => dispatch(addExpense(expenseProperties)),

        removeExpenses: (expenses) => {
            const asArray = [].concat(expenses);
            asArray.forEach(e => dispatch(removeExpense(e)));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);