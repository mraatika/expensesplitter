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
            <table id="transactions-list" className="u-full-width">
            <tbody>
                {
                    transactions.length ? this.props.transactions.map(transaction =>
                        <Transaction
                            key={transaction.from + '-' + transaction.to}
                            transaction={transaction}
                            participants={participants} />
                    ) : <tr><td><i>{ t('transactions.no_transactions') }</i></td></tr>
                }
            </tbody>
            </table>
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
