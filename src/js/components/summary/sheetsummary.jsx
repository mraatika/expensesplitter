'use strict';

import React from 'react';
import _ from 'lodash';
import {t} from '../../dictionary/dictionary';
import TransactionsService from '../../service/transactionsservice';
import ExpenseList from '../expenses/expenselist.jsx';
import TransactionsList from '../transactions/transactionslist.jsx';
import SharesTable from '../shares/sharestable.jsx';

var SheetSummary = React.createClass({

    render() {
        var { participants, expenses } = this.props.sheet;
        var transactions = new TransactionsService(this.props.sheet).calculateTransactions();

        return (
            <div id="summary-preview">
                <h1>{this.props.sheet.name}</h1>

                <h2>{t('lang.transaction_plural')}:</h2>
                <TransactionsList
                    participants={participants}
                    transactions={transactions}/>

                <h2>{t('lang.expense_plural')}:</h2>
                <ExpenseList
                    expenses={expenses}
                    participants={participants} />

                <h2>{t('lang.share_plural')}:</h2>
                <SharesTable
                    participants={participants}
                    expenses={expenses} />
                <br/>

                <div>{t('summary.preview_created')} @ { new Date().toLocaleString() }</div>
            </div>
        );
    }
});

export default SheetSummary;