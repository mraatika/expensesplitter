'use strict';

import React from 'react';
import ActionCreator from '../../actions/dataactioncreators';
import {t} from '../../dictionary/dictionary';
import {ModalDialog} from '../common/modaldialog.jsx';
import ExpensesService from '../../service/expensesservice';
import {TrashButton} from '../common/trashbutton.jsx';

export class Participant extends React.Component {

    handleRemoveClick() {
        let props = this.props;
        let expensesService = new ExpensesService(props.sheet);
        let expensesParticipatedIn = expensesService.findExpensesByParticipant(props.participant.id);
        let expensesPaidBy = expensesService.findExpensesPaidByParticipant(props.participant.id);

        if (expensesParticipatedIn.length || expensesPaidBy.length) {
            this.refs.removeConfirmationDialog.open();
        } else {
            this.onRemoveConfirmed();
        }
    }

    onRemoveConfirmed() {
        ActionCreator.removeParticipant(this.props.participant);
    }

    render() {
        let participant = this.props.participant;
        let buttons = [
            {
                label: t('participants.remove_participant'),
                click: this.onRemoveConfirmed.bind(this),
                icon: 'fa-trash-o',
                buttonStyle: 'danger'
            },
            {
                label: t('lang.cancel'),
                icon: 'fa-times'
            }
        ];

        return (
            <li>
                <div className="list-text-cell">
                    <i className="fa fa-user fa-lg fa-fw" />
                    <span className="participant-list-participant">
                        {participant.name}
                    </span>
                </div>
                <div className="list-icon-cell text-right">
                    <TrashButton onClick={this.handleRemoveClick.bind(this)}/>
                </div>
                <ModalDialog
                    ref="removeConfirmationDialog"
                    showModal={false}
                    header={ t('participants.confirm_removal_title') }
                    buttons={buttons}
                    className="small">
                    { t('participants.confirm_removal') }
                </ModalDialog>
            </li>
        );
    }
}
