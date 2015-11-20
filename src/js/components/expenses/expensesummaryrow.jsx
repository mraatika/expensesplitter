import React from 'react';
import ActionCreator from '../../actions/dataactioncreators';
import ExpensesService from '../../service/expensesservice';
import {t} from '../../dictionary/dictionary';

/**
 * @class ExpenseSummaryRow
 * @description Footer row for ExpenseList table
 * @extends {ReactComponent}
 */
export default class ExpenseSummaryRow extends React.Component {

    _handleRemoveAllClick() {
        ActionCreator.removeAllExpenses();
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const totalSum = new ExpensesService({
            expenses: this.props.expenses
        }).getTotalSum();

        return (
            <tr>
                <td><strong>{t('lang.total')}:</strong></td>
                <td><strong>{totalSum}</strong></td>
                <td colSpan="4" className="text-right">
                    {
                        this.props.isRemoveAllowed ?
                        <button
                            type="button"
                            onClick={this._handleRemoveAllClick}
                            disabled={!this.props.expenses.length}>
                            { t('lang.remove_all') }
                        </button> : ''
                    }
                </td>
            </tr>
        );
    }
}
