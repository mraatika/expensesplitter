import React from 'react';
import ActionCreator from '../../actions/dataactioncreators';
import ExpensesService from '../../service/expensesservice';
import {t} from '../../dictionary/dictionary';

export class ExpenseSummaryRow extends React.Component {

    handleRemoveAllClick() {
        ActionCreator.removeAllExpenses();
    }

    render() {
        var totalSum = new ExpensesService({
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
                            onClick={this.handleRemoveAllClick}
                            disabled={!this.props.expenses.length}>
                            { t('lang.remove_all') }
                        </button> : ''
                    }
                </td>
            </tr>
        );
    }
}
