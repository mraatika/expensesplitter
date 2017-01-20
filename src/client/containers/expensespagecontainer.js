import {connect} from 'react-redux';
import ExpensesPage from 'client/components/expenses/expensespage.jsx';
import {addExpense, removeExpense} from 'client/stores/expensesreducer';
import {ArrayUtils} from 'client/util/utils';
import {getAllBalancesAndShares} from 'client/service/expensesservice';

function mapStateToProps(state) {
    const {expenses, participants, sheet, settings} = state;
    const sharesAndBalances = getAllBalancesAndShares({ expenses, participants });

    return {
        sheet,
        participants: ArrayUtils.rejectRemoved(participants),
        expenses: ArrayUtils.rejectRemoved(expenses),
        settings,
        sharesAndBalances
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