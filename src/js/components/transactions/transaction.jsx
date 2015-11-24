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
        const {transaction, participants, settings} = this.props;
        const findParticipant = participantId => {
            return _.find(participants, (participant => participant.id === participantId)).name;
        };

        return (
            <tr>
                <td className="transactions-list-from">{findParticipant(transaction.from)}</td>
                <td>&#8680;</td>
                <td className="transactions-list-to">{findParticipant(transaction.to)}</td>
                <td className="transactions-list-amount">{transaction.amount} {settings.currencySymbol}</td>
            </tr>
        );
    }
}

Transaction.propTypes = {
    transaction: React.PropTypes.object.isRequired,
    participants: React.PropTypes.array.isRequired
};