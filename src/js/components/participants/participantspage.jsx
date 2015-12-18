import React from 'react';
import SheetStore from '../../stores/sheetstore.js';
import ParticipantStore from '../../stores/participantstore.js';
import ExpenseStore from '../../stores/expensestore.js';
import pages from '../../constants/pages';
import ParticipantList from './participantlist.jsx';
import ParticipantAddForm from './participantaddform.jsx';
import Navigation from '../navigation/navigation.jsx';
import {t} from '../../dictionary/dictionary';
import ActionCreator from '../../actions/dataactioncreators';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';
import ExpensesService from '../../service/expensesservice';

/**
 * @class ParticipantsPage
 * @description Page for displaying and adding participants
 * @extends {ReactComponent}
 */
export default class ParticipantsPage extends React.Component {
    /**
     * @constructor
     * @param  {object} props
     * @return {ParticipantsPage}
     */
    constructor(props) {
        super(props);
        this.state = this._formState(props);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ParticipantStore.addChangeListener(this._onChange);
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ParticipantStore.removeChangeListener(this._onChange);
        SheetStore.removeChangeListener(this._onChange);
    }

    _formState(props) {
        const currentSheet = SheetStore.getSheet(props.currentSheetId) || {};

        return {
            currentSheet: currentSheet,
            participants: ParticipantStore.getParticipants(currentSheet.id)
        };
    }

    /**
     * Callback for SheetStore's events
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState(this._formState(this.props));
    }

    /**
     * Callback for participant removal button transfered to Participant component (list element)
     * @private
     * @param  {object} participant
     * @return {undefined}
     */
    _handleParticipantRemoval(participant) {
        const expensesService = new ExpensesService({ expenses: ExpenseStore.getExpenses(this.state.currentSheet.id) });
        const expensesParticipatedIn = expensesService.findExpensesByParticipant(participant.id);
        const expensesPaidBy = expensesService.findExpensesPaidByParticipant(participant.id);

        if (expensesParticipatedIn.length || expensesPaidBy.length) {
            // after confirmation promise is resolved
            this._removeConfirmationDialog.open().then(() => this._removeParticipant(participant));
        } else {
            this._removeParticipant(participant);
        }
    }

    /**
     * Remove the given participant from the current sheet
     * @private
     * @param  {object} participant
     * @return {undefined}
     */
    _removeParticipant(participant) {
        ActionCreator.removeParticipant(participant);
    }

    _addParticipant(participantProperties) {
        ActionCreator.addParticipant(participantProperties, this.state.currentSheet.id);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <section id="participants-page">
                <h2>{ t('lang.participant_plural') }</h2>
                <ParticipantList
                    participants={this.state.participants}
                    onRemoveClick={this._handleParticipantRemoval.bind(this) }/>
                <ParticipantAddForm
                    onFormSubmit={this._addParticipant.bind(this)}
                    participants={this.state.participants} />

                <Navigation currentPage={pages.PARTICIPANTS} />

                <RemovalConfirmationDialog
                    ref={c => this._removeConfirmationDialog = c}
                    header={ t('common.confirm_removal') }
                    contentText={ t('participants.confirm_removal') }
                    okButtonLabel={ t('participants.remove_participant') }
                />
            </section>

        );
    }
}
