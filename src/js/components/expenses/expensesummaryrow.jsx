import React from 'react';
import ActionCreator from '../../actions/dataactioncreators';
import ExpensesService from '../../service/expensesservice';
import {t} from '../../dictionary/dictionary';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';

/**
 * @class ExpenseSummaryRow
 * @description Footer row for ExpenseList table
 * @extends {ReactComponent}
 */
export default class ExpenseSummaryRow extends React.Component {

    _handleRemoveAllClick() {
        this._removalConfirmationDialog.open();
    }

    _onRemovalConfirmed() {
        ActionCreator.removeAllExpenses(this.props.sheet.id);
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
                                onRemoveConfirmed={this._onRemovalConfirmed.bind(this)}
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
