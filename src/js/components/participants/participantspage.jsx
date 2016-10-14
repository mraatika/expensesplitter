import React, {PropTypes} from 'react';
import pages from '../../constants/pages';
import ParticipantList from './participantlist.jsx';
import ParticipantAddForm from './participantaddform.jsx';
import Navigation from '../navigation/navigation.jsx';
import {t} from '../../dictionary/dictionary';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';
import ExpensesService from '../../service/expensesservice';

/**
 * @class ParticipantsPage
 * @description Page for displaying and adding participants
 * @extends {ReactComponent}
 */
class ParticipantsPage extends React.Component {

    /**
     * Callback for participant removal button transfered to Participant component (list element)
     * @private
     * @param  {object} participant
     * @return {undefined}
     */
    _handleParticipantRemoval(participant) {
        const expensesService = new ExpensesService({ expenses: this.props.sheet.expenses });
        const expensesParticipatedIn = expensesService.findAllExpensesOfParticipant(participant.id);

        if (!expensesParticipatedIn.length) {
            this._removeParticipant(participant);
            return;
        }

        // after confirmation promise is resolved
        this._removeConfirmationDialog
            .open()
            .then(() => this._removeParticipant(participant, expensesParticipatedIn));
    }

    /**
     * Remove the given participant from the current sheet
     * @private
     * @param  {object} participant
     * @return {undefined}
     */
    _removeParticipant(participant, expenses = []) {
        this.props.removeParticipant(this.props.sheet, participant, expenses);
    }

    /**
     * Add participant to the current sheet's participants list
     * @private
     * @param  {Object} participant
     * @return {undefined}
     */
    _addParticipant(participant) {
        this.props.addParticipant(this.props.sheet, participant);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {participants} = this.props.sheet;

        return (
            <section id="participants-page">
                <h2>{ t('lang.participant_plural') }</h2>
                <ParticipantList
                    participants={participants}
                    onRemoveClick={this._handleParticipantRemoval.bind(this) }/>
                <ParticipantAddForm
                    onFormSubmit={this._addParticipant.bind(this)}
                    participants={participants} />

                <Navigation currentPage={pages.PARTICIPANTS} sheetId={this.props.sheet.id} />

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

ParticipantsPage.propTypes = {
    sheet: PropTypes.object.isRequired,
    addParticipant: PropTypes.func.isRequired,
    removeParticipant: PropTypes.func.isRequired
};

export default ParticipantsPage;