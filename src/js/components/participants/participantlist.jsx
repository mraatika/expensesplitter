'use strict';

import React from 'react';
import {Participant} from './participant.jsx';
import {t} from '../../dictionary/dictionary';

export class ParticipantList extends React.Component {
    render() {
        var participants = this.props.participants;

        return (
            <ul id="participants-list">
                {
                    participants.length ? participants.map(participant =>
                            <Participant key={participant.id} participant={participant} sheet={this.props.sheet} />
                    ) : <li><i>{ t('participants.no_participants') }</i></li>
                }
            </ul>
        );
    }
}

ParticipantList.defaultProps = { participants: [] };
