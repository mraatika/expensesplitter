import {connect} from 'react-redux';
import ParticipantsPage from 'client/components/participants/participantspage.jsx';
import {addParticipant, removeParticipant} from 'client/actions/dataactioncreators';
import {ArrayUtils} from 'client/util/utils';

function mapStateToProps(state) {
    const {sheet, settings} = state;
    return {
        sheet,
        participants: ArrayUtils.rejectRemoved(sheet.participants),
        expenses: sheet.expenses.filter(e => !e.removed),
        settings
    };
}

function mapDispatchToProps(dispatch) {

    return {
        /**
         * Add new participant to sheet's participants list
         * @param  {[type]} sheet [description]
         * @param  {[type]} participantProperties [description]
         * @return {[type]}
         */
        addParticipant: participant => dispatch(addParticipant(participant)),
        /**
         * Remove a participant (and expenses the participant is participated in)
         * from given sheet
         * @param  {Object} sheet
         * @param  {Object} participant
         * @param  {Array} expensesToBeRemoved
         */
        removeParticipant: (participant, expensesToBeRemoved) => {
            dispatch(removeParticipant(participant, expensesToBeRemoved));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsPage);