import React from 'react';
import {ArrayUtils, NumberUtils} from 'client/util/utils';

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

        return (
            <tr>
                <td className="transactions-list-from">{ArrayUtils.findById(participants, transaction.from).name}</td>
                <td>&#8680;</td>
                <td className="transactions-list-to">{ArrayUtils.findById(participants, transaction.to).name}</td>
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