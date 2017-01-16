import React, {PropTypes} from 'react';
import pages from 'client/constants/pages';
import ParticipantList from 'client/components/participants/participantlist.jsx';
import ParticipantAddForm from 'client/components/participants/participantaddform.jsx';
import Navigation from 'client/components/navigation/navigation.jsx';
import {t} from 'common/dictionary/dictionary';
import RemovalConfirmationDialog from 'client/components/common/removalconfirmationdialog.jsx';
import {findAllExpensesOfParticipant} from 'client/service/expensesservice';

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
        const {expenses} = this.props;
        const expensesParticipatedIn = findAllExpensesOfParticipant(expenses)(participant.id);

        if (expensesParticipatedIn.length) {
            this._removeConfirmationDialog.open();
            // bind function argument so it's called with participant
            // after confirmation
            this._participantRemovalConfirmed = this._participantRemovalConfirmed.bind(this, participant);
            return;
        }

        this.props.removeParticipant(participant);
    }

    /**
     * Callback for removal confirmation. Bound to context and argument when removal button is clicked.
     * @private
     * @param   {Object} participant
     */
    _participantRemovalConfirmed(participant) {
        const {expenses} = this.props;
        const expensesParticipatedIn = findAllExpensesOfParticipant(expenses)(participant.id);

        this.props.removeParticipant(participant, expensesParticipatedIn);
    }

    /**
     * Add participant to the current sheet's participants list
     * @private
     * @param  {Object} participant
     * @return {undefined}
     */
    _addParticipant(participant) {
        this.props.addParticipant(participant);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {participants, sheet} = this.props;

        return (
            <section id="participants-page">
                <h2>{ t('lang.participant_plural') }</h2>
                <ParticipantList
                    participants={participants}
                    onRemoveClick={this._handleParticipantRemoval.bind(this) }/>
                <ParticipantAddForm
                    onFormSubmit={this._addParticipant.bind(this)}
                    participants={participants} />

                <Navigation currentPage={pages.PARTICIPANTS} sheetId={sheet.id} />

                <RemovalConfirmationDialog
                    ref={c => this._removeConfirmationDialog = c}
                    onRemoveConfirmed={() => this._participantRemovalConfirmed()}
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
    participants: PropTypes.array.isRequired,
    expenses: PropTypes.array.isRequired,
    addParticipant: PropTypes.func.isRequired,
    removeParticipant: PropTypes.func.isRequired
};

export default ParticipantsPage;