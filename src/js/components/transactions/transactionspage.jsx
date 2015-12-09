import React from 'react';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import TransactionsList from './transactionslist.jsx';
import Navigation from '../navigation/navigation.jsx';
import ParticipantSummaryList from '../shares/participantsummarylist.jsx';
import TransactionsService from '../../service/transactionsservice';
import ExpensesService from '../../service/expensesservice';

/**
 * @class TransactionsPage
 * @description Page displaying transactions
 * @extends {ReactComponent}
 */
export default class TransactionsPage extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {participants, expenses, sheet} = this.props;
        const transactions = new TransactionsService().calculateTransactions(expenses, participants);
        const sharesAndBalances = new ExpensesService().getAllBalancesAndShares(participants, expenses);

        return (
            <section id="transactions-page">
                <h2>{ t('lang.transaction_plural') }</h2>
                <TransactionsList
                    transactions={transactions}
                    participants={participants}
                    settings={sheet.settings}/>

                <h2>{ t('lang.expense_plural') }</h2>
                <ParticipantSummaryList
                    participants={participants}
                    sharesAndBalances={sharesAndBalances}
                    expenses={expenses}
                    settings={sheet.settings}/>

                <Navigation currentPage={pages.TRANSACTIONS} />

            </section>
        );
    }
}
