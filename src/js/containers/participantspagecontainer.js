import {without} from 'lodash';
import {connect} from 'react-redux';
import ParticipantFactory from 'factory/participantfactory';
import ParticipantsPage from 'components/participants/participantspage.jsx';
import {updateSheet} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet} = state.sheet;
    return { sheet };
}

function mapDispatchToProps(dispatch) {

    return {
        addParticipant: (sheet, participantProperties) => {
            const participant = ParticipantFactory.create(participantProperties);

            dispatch(updateSheet(sheet, {
                participants: sheet.participants.concat([ participant ])
            }));
        },
        removeParticipant: (sheet, participant) => {
            dispatch(updateSheet(sheet, {
                participants: without(sheet.participants, participant)
            }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsPage);