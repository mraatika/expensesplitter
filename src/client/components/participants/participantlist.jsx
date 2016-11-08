import React, {PropTypes} from 'react';
import {sortBy, map} from 'lodash';
import Participant from 'client/components/participants/participant.jsx';
import {t} from 'common/dictionary/dictionary';

/**
 * @class ParticipantList
 * @description List of Participant components
 * @extends {ReactComponent}
 */
class ParticipantList extends React.Component {
    /**
     * @return {ReactComponent}
     */
    render() {
        const participants = sortBy(this.props.participants, 'name');

        return (
            <ul id="participants-list">
            {
                participants.length ? map(participants, participant =>
                    <Participant
                        key={participant.id}
                        participant={participant}
                        onRemoveClick={this.props.onRemoveClick}/>
                ) : <li><i>{ t('participants.no_participants') }</i></li>
            }
            </ul>
        );
    }
}

ParticipantList.defaultProps = {
    participants: []
};

ParticipantList.propTypes = {
    onRemoveClick: PropTypes.func.isRequired,
    participants: PropTypes.array
};

export default ParticipantList;