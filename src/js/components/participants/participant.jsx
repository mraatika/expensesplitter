import React from 'react';
import ActionCreator from '../../actions/dataactioncreators';
import {t} from '../../dictionary/dictionary';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';
import ExpensesService from '../../service/expensesservice';
import {TrashButton} from '../common/trashbutton.jsx';

export default class Participant extends React.Component {

    _handleRemoveClick() {
        const {sheet, participant} = this.props;
        const expensesService = new ExpensesService(sheet);
        const expensesParticipatedIn = expensesService.findExpensesByParticipant(participant.id);
        const expensesPaidBy = expensesService.findExpensesPaidByParticipant(participant.id);

        if (expensesParticipatedIn.length || expensesPaidBy.length) {
            this._removeConfirmationDialog.open();
        } else {
            this.onRemoveConfirmed();
        }
    }

    _onRemoveConfirmed() {
        ActionCreator.removeParticipant(this.props.participant);
    }

    render() {
        return (
            <li>
                <div className="list-text-cell">
                    <i className="fa fa-user fa-lg fa-fw" />
                    <span className="participant-list-participant">
                        {this.props.participant.name}
                    </span>
                </div>
                <div className="list-icon-cell text-right">
                    <TrashButton onClick={this._handleRemoveClick.bind(this)}/>
                </div>
                <RemovalConfirmationDialog
                    ref={c => this._removeConfirmationDialog = c}
                    onRemoveConfirmed={this._onRemoveConfirmed.bind(this)}
                    header={ t('common.confirm_removal') }
                    contentText={ t('participants.confirm_removal') }
                    okButtonLabel={ t('participants.remove_participant') }
                />
            </li>
        );
    }
}
