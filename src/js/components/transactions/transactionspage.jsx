'use strict';

import React from 'react';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import TransactionsList from './transactionslist.jsx';
import Navigation from '../navigation.jsx';
import ParticipantSharesSummaryList from '../shares/participantssharesummarylist.jsx';

var TransactionsPage = React.createClass({

    openSummary(e) {
        e.preventDefault();
        window.open(window.location.origin + '/#!/summary/static');
    },

    render() {
        var sheet = this.props.currentSheet;

        return (
            <section className="transactions-page">
                <h1>{ t('lang.transaction_plural') }:</h1>
                <TransactionsList
                    transactions={this.props.transactions}
                    participants={sheet.participants} />

                <ParticipantSharesSummaryList
                    participants={sheet.participants}
                    expenses={sheet.expenses}
                    sharesAndBalances={this.props.sharesAndBalances} />

                <a
                    aria-role="button"
                    href="/"
                    onClick={this.openSummary}>
                    {t('lang.summary')}
                </a>

                <Navigation prev={pages.EXPENSES}/>
            </section>
        );
    }
});

export default TransactionsPage;
