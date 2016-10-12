import React from 'react';
import ExpensesService from 'service/expensesservice';
import {t} from 'dictionary/dictionary';
import RemovalConfirmationDialog from 'components/common/removalconfirmationdialog.jsx';

/**
 * @class ExpenseSummaryRow
 * @description Footer row for ExpenseList table
 * @extends {ReactComponent}
 */
export default class ExpenseSummaryRow extends React.Component {

    _handleRemoveAllClick() {
        this._removalConfirmationDialog.open();
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {expenses} = this.props;
        const totalSum = new ExpensesService({ expenses }).getTotalSum();

        return (
            <tr>
                <td><strong>{t('lang.total')}:</strong></td>
                <td colSpan="2" ><strong>{totalSum} {this.props.currencySymbol}</strong></td>
                <td colSpan="3" className="text-right">
                    {
                        !this.props.isRemoveAllowed ? '' :
                        <div>
                            <button
                                type="button"
                                onClick={this._handleRemoveAllClick.bind(this)}
                                disabled={!this.props.expenses.length}>
                                { t('lang.remove_all') }
                            </button>
                            <RemovalConfirmationDialog
                                ref={ c => this._removalConfirmationDialog = c }
                                onRemoveConfirmed={() => this.props.removeExpenses(expenses)}
                                header={ t('common.confirm_removal') }
                                contentText={ t('expenses.remove_all_confirmation') }
                                okButtonLabel={ t('expenses.remove_all_expenses') }
                            />
                        </div>
                    }
                </td>
            </tr>
        );
    }
}
