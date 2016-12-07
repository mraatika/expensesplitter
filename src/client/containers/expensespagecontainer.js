import {connect} from 'react-redux';
import ExpensesPage from 'client/components/expenses/expensespage.jsx';
import {addExpense, removeExpense} from 'client/actions/dataactioncreators';
import {ArrayUtils} from 'client/util/utils';

function mapStateToProps(state) {
    const {expenses, participants, sheet, settings} = state;

    return {
        sheet,
        participants: ArrayUtils.rejectRemoved(participants),
        expenses: ArrayUtils.rejectRemoved(expenses),
        settings
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