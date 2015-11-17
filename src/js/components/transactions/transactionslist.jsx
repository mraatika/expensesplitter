'use strict';

import React from 'react';
import Transaction from './transaction.jsx';
import {t} from '../../dictionary/dictionary';

var TransactionsList = React.createClass({

    getDefaultProps: function() {
        return {
            transactions: [],
            participants: []
        };
    },

    render: function() {
        var participants = this.props.participants;
        var transactions = this.props.transactions;

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

});

export default TransactionsList;
