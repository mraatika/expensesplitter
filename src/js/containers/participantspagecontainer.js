import {without} from 'lodash';
import {connect} from 'react-redux';
import ParticipantFactory from 'factory/participantfactory';
import ParticipantsPage from 'components/participants/participantspage.jsx';
import {updateSheet} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet} = state.sheet;
    return { sheet, settings: state.settings };
}

function mapDispatchToProps(dispatch) {

    return {
        /**
         * Add new participant to sheet's participants list
         * @param  {[type]} sheet [description]
         * @param  {[type]} participantProperties [description]
         * @return {[type]}
         */
        addParticipant: (sheet, participantProperties) => {
            const participant = ParticipantFactory.create(participantProperties);

            dispatch(updateSheet(sheet, {
                participants: sheet.participants.concat([ participant ])
            }));
        },
        /**
         * Remove a participant (and expenses the participant is participated in)
         * from given sheet
         * @param  {Object} sheet
         * @param  {Object} participant
         * @param  {Array} expensesToBeRemoved
         */
        removeParticipant: (sheet, participant, expensesToBeRemoved) => {
            dispatch(updateSheet(sheet, {
                participants: without(sheet.participants, participant),
                expenses: without(sheet.expenses, ...expensesToBeRemoved)
            }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsPage);