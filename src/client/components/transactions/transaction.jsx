import React from 'react';
import {find} from 'lodash';
import {NumberUtils} from '../../util/utils.js';

/**
 * @class Transaction
 * @description A list element representing a transaction
 * @extends {ReactComponent}
 */
class Transaction extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {transaction, participants, currencySymbol} = this.props;
        const findParticipant = participantId => {
            return find(participants, (participant => participant.id === participantId)).name;
        };

        return (
            <tr>
                <td className="transactions-list-from">{findParticipant(transaction.from)}</td>
                <td>&#8680;</td>
                <td className="transactions-list-to">{findParticipant(transaction.to)}</td>
                <td className="transactions-list-amount">{NumberUtils.round(transaction.amount, 1)} {currencySymbol}</td>
            </tr>
        );
    }
}

Transaction.propTypes = {
    transaction: React.PropTypes.object.isRequired,
    participants: React.PropTypes.array.isRequired,
    currencySymbol: React.PropTypes.string
};

export default Transaction;