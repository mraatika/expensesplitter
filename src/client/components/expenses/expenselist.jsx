import React, {PropTypes} from 'react';
import Expense from './expense.jsx';
import ExpenseSummaryRow from './expensesummaryrow.jsx';
import {t} from 'common/dictionary/dictionary';

/**
 * @class ExpenseList
 * @description A list for Expense components representing
 * expenses added to the current sheet
 * @extends {ReactComponent}
 */
class ExpenseList extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        var {expenses, participants} = this.props;

        return (
            <table className="u-full-width">
                <thead>
                <tr>
                    <th>{ t('lang.expense') }:</th>
                    <th>{ t('lang.price') }:</th>
                    <th>{ t('expenses.per_participant') }:</th>
                    <th>{ t('lang.participant_plural') }:</th>
                    <th>{ t('lang.payer') }:</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {
                        expenses.length ? expenses.map(expense =>
                            <Expense
                                key={expense.id}
                                expense={expense}
                                removeExpenses={this.props.removeExpenses}
                                isRemoveAllowed={this.props.isRemoveAllowed}
                                participants={participants} />
                        ) : <tr>
                            <td colSpan="6">
                                <i>{ t('expenses.no_expenses') }</i>
                            </td>
                            </tr>
                    }
                </tbody>
                {
                    this.props.hideFooter ? '' :
                    <tfoot>
                        <ExpenseSummaryRow
                            expenses={expenses}
                            removeExpenses={this.props.removeExpenses}
                            isRemoveAllowed={this.props.isRemoveAllowed}
                            currencySymbol={this.props.currencySymbol}/>
                    </tfoot>
                }
            </table>
        );
    }
}

ExpenseList.defaultProps = {
    expenses: [],
    participants: [],
    isRemoveAllowed: true,
    hideFooter: false,
    currencySymbol: ''
};

ExpenseList.propTypes = {
    /**
     * Function for removing expenses
     * @type {Function}
     */
    removeExpenses: PropTypes.func,
    /**
     * An array of Expense objects
     * @type {array}
     */
    expenses: PropTypes.array,
    /**
     * An array of Participant objects
     * @type {array}
     */
    participants: PropTypes.array,
    /**
     * Is removing of expenses allowed
     * @type {boolean}
     */
    isRemoveAllowed: PropTypes.bool,
    /**
     * Should the footer be hidden
     * @type {boolean}
     */
    hideFooter: PropTypes.bool,

    /**
     * Symbol to be appended to currency values
     * @type {string}
     */
    currencySymbol: PropTypes.string

};

export default ExpenseList;