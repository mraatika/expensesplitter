import React from 'react';
import SheetStore from '../../stores/sheetstore.js';
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
        this.state = { currentSheet: this.props.currentSheet };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetStore.removeChangeListener(this._onChange);
    }

    /**
     * Callback for SheetStore's events
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState({ currentSheet: SheetStore.getCurrentSheet() });
    }

    /**
     * Callback for participant removal button transfered to Participant component (list element)
     * @private
     * @param  {object} participant
     * @return {undefined}
     */
    _handleParticipantRemoval(participant) {
        const expensesService = new ExpensesService(this.state.currentSheet);
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

    /**
     * @return {ReactComponent}
     */
    render() {
        const sheet = this.state.currentSheet;

        return (
            <section id="participants-page">
                <h2>{ t('lang.participant_plural') }</h2>
                <ParticipantList
                    sheet={sheet}
                    onRemoveClick={this._handleParticipantRemoval.bind(this) }/>
                <ParticipantAddForm participants={sheet.participants} />

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
