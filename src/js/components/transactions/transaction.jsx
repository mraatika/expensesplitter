import React from 'react';
import _ from 'lodash';

/**
 * @class Transaction
 * @description A list element representing a transaction
 * @extends {ReactComponent}
 */
export default class Transaction extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {transaction, participants} = this.props;
        const findParticipant = participantId => {
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

Transaction.propTypes = {
    transaction: React.PropTypes.object.isRequired,
    participants: React.PropTypes.array.isRequired
};