import React from 'react';
import Transaction from './transaction.jsx';
import {t} from 'common/dictionary/dictionary';

/**
 * @class TransactionsList
 * @description List for transactions
 * @extends {ReactComponent}
 */
class TransactionsList extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {transactions} = this.props;

        return (
            <table id="transactions-list" className="u-full-width">
            <tbody>
                {
                    transactions.length ? transactions.map(transaction =>
                        <Transaction
                            key={transaction.from + '-' + transaction.to}
                            transaction={transaction}
                            {...this.props} />
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
     * @type {array}
     */
    transactions: React.PropTypes.array,
    /**
     * List of participants
     * @type {array}
     */
    participants: React.PropTypes.array,
    /**
     * Currency symbol
     * @type {string}
     */
    currencySymbol: React.PropTypes.string
};

export default TransactionsList;