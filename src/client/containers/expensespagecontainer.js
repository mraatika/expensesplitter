import {connect} from 'react-redux';
import ExpensesPage from 'client/components/expenses/expensespage.jsx';
import {addExpense, removeExpense} from 'client/actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet} = state.sheet;

    return {
        sheet,
        participants: sheet.participants.filter(p => !p.removed),
        expenses: sheet.expenses.filter(e => !e.removed),
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