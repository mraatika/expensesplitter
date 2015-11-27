import React from 'react';
import Expense from './expense.jsx';
import ExpenseSummaryRow from './expensesummaryrow.jsx';
import {t} from '../../dictionary/dictionary';

/**
 * @class ExpenseList
 * @description A list for Expense components representing
 * expenses added to the current sheet
 * @extends {ReactComponent}
 */
export default class ExpenseList extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        var expenses = this.props.expenses;

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
                                isRemoveAllowed={this.props.isRemoveAllowed}
                                expense={expense}
                                participants={this.props.participants} />
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
                            isRemoveAllowed={this.props.isRemoveAllowed}
                            settings={this.props.settings}/>
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
    hideFooter: false
};

ExpenseList.propTypes = {
    /**
     * An array of Expense objects
     * @type {array}
     */
    expenses: React.PropTypes.array,
    /**
     * An array of Participant objects
     * @type {array}
     */
    participants: React.PropTypes.array,
    /**
     * Is removing of expenses allowed
     * @type {boolean}
     */
    isRemoveAllowed: React.PropTypes.bool,
    /**
     * Should the footer be hidden
     * @type {boolean}
     */
    hideFooter: React.PropTypes.bool
};
