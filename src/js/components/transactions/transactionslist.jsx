import React from 'react';
import Transaction from './transaction.jsx';
import {t} from '../../dictionary/dictionary';

/**
 * @class TransactionsList
 * @description List for transactions
 * @extends {ReactComponent}
 */
export default class TransactionsList extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {participants, transactions} = this.props;

        return (
            <ul id="transactions-list">
                {
                    transactions.length ? this.props.transactions.map(transaction =>
                        <Transaction
                            key={transaction.from + '-' + transaction.to}
                            transaction={transaction}
                            participants={participants} />
                    ) : <li><i>{ t('transactions.no_transactions') }</i></li>
                }
            </ul>
        );
    }
}

TransactionsList.defaultProps = {
    transactions: [],
    participants: []
};

TransactionsList.propTypes = {
    /**
     * List of transactions
     * @type {Array}
     */
    transactions: React.PropTypes.array,
    /**
     * List of participants
     * @type {Array}
     */
    participants: React.PropTypes.array
};
