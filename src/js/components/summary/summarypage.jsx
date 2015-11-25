import React from 'react';
import {t} from '../../dictionary/dictionary';
import TransactionsService from '../../service/transactionsservice';
import {ExpenseList} from '../expenses/expenselist.jsx';
import TransactionsList from '../transactions/transactionslist.jsx';
import SharesTable from '../shares/sharestable.jsx';
import pages from '../../constants/pages';
import {Navigation} from '../navigation/navigation.jsx';

export default class SheetSummary extends React.Component {

    render() {
        var {participants, expenses, settings} = this.props.sheet;
        var transactions = new TransactionsService(this.props.sheet).calculateTransactions();

        return (
            <div id="summary-page">
                <h1>{this.props.sheet.name}</h1>

                <h2>{t('lang.transaction_plural')}:</h2>
                <TransactionsList
                    participants={participants}
                    transactions={transactions}
                    settings={settings}/>

                <h2>{t('lang.expense_plural')}:</h2>
                <ExpenseList
                    expenses={expenses}
                    participants={participants}
                    isRemoveAllowed={false}
                    settings={settings}/>

                <h2>{t('lang.share_plural')}:</h2>
                <SharesTable
                    participants={participants}
                    expenses={expenses} />
                <br/>

                <div>{t('summary.preview_created')} @ { new Date().toLocaleString() }</div>

                <Navigation prev={pages.TRANSACTIONS}/>
            </div>
        );
    }
}