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
        const sheet = this.props.sheet;
        const participants = _.sortBy(sheet.participants, 'name');

        return (
            <ul id="participants-list">
            {
                participants.length ? participants.map(participant =>
                    <Participant key={participant.id} participant={participant} sheet={sheet} />
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
    sheet: React.PropTypes.object.isRequired
};
