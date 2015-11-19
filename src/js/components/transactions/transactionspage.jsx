import React from 'react';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import TransactionsList from './transactionslist.jsx';
import {Navigation} from '../navigation/navigation.jsx';
import ParticipantSummaryList from '../shares/participantsummarylist.jsx';

/**
 * @class TransactionsPage
 * @description Page displaying transactions
 * @extends {ReactComponent}
 */
export class TransactionsPage extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const sheet = this.props.currentSheet;
        const {participants, expenses} = sheet;

        return (
            <section className="transactions-page">
                <h1>{ t('lang.transaction_plural') }:</h1>
                <TransactionsList
                    transactions={this.props.transactions}
                    participants={participants} />

                <h2>{ t('lang.expense_plural') }</h2>
                <ParticipantSummaryList
                    participants={participants}
                    sharesAndBalances={this.props.sharesAndBalances}
                    expenses={expenses}/>

                <div className="text-right">
                    <a
                        className="button"
                        aria-role="button"
                        href={pages.SUMMARY.href}>
                        {t(pages.SUMMARY.label)}
                    </a>
                </div>

                <Navigation prev={pages.EXPENSES}/>
            </section>
        );
    }
}
