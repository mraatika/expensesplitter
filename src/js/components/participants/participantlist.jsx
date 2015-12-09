import React from 'react';
import _ from 'lodash';
import Participant from './participant.jsx';
import {t} from '../../dictionary/dictionary';

/**
 * @class ParticipantList
 * @description List of Participant components
 * @extends {ReactComponent}
 */
export default class ParticipantList extends React.Component {
    /**
     * @return {ReactComponent}
     */
    render() {
        const participants = _.sortBy(this.props.participants, 'name');

        return (
            <ul id="participants-list">
            {
                participants.length ? participants.map(participant =>
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

ParticipantList.propTypes = {
    /**
     * The current sheet. Required.
     * @type {object}
     */
    participants: React.PropTypes.array.isRequired
};
