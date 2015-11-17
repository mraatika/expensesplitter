'use strict';

import React from 'react';
import _ from 'lodash';

export class Transaction extends React.Component {

    render() {
        var transaction = this.props.transaction;
        var participants = this.props.participants;
        var findParticipant = function (participantId) {
            return _.find(participants, (participant => participant.id === participantId)).name;
        };

        return (
            <li>
                <span className="transactions-list-from">{findParticipant(transaction.from)}</span>
                <span>&#8680;</span>
                <span className="transactions-list-to">{findParticipant(transaction.to)}</span>
                <span className="transactions-list-amount">{transaction.amount}</span>
            </li>
        );
    }
}