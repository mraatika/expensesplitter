import React from 'react';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import ExpenseStore from '../../stores/expensestore.js';
import SheetStore from '../../stores/sheetstore.js';
import ParticipantStore from '../../stores/participantstore.js';
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

    constructor(props) {
        super(props);
        this.state = this._formState(props);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetStore.removeChangeListener(this._onChange);
    }

    _formState(props) {
        const currentSheet = SheetStore.getSheet(props.currentSheetId) || {};

        return {
            currentSheet: currentSheet,
            participants: ParticipantStore.getParticipants(currentSheet.id),
            expenses: ExpenseStore.getExpenses(currentSheet.id),
            settings: currentSheet.settings || {}
        };
    }

    _onChange() {
        this.setState(this._formState(this.props));
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {participants, expenses, settings} = this.state;
        const transactions = new TransactionsService().calculateTransactions(expenses, participants);
        const sharesAndBalances = new ExpensesService().getAllBalancesAndShares(participants, expenses);

        return (
            <section id="transactions-page">
                <h2>{ t('lang.transaction_plural') }</h2>
                <TransactionsList
                    transactions={transactions}
                    participants={participants}
                    currencySymbol={settings.currencySymbol}/>

                <h2>{ t('lang.expense_plural') }</h2>
                <ParticipantSummaryList
                    participants={participants}
                    sharesAndBalances={sharesAndBalances}
                    expenses={expenses}
                    currencySymbol={settings.currencySymbol}/>

                <Navigation currentPage={pages.TRANSACTIONS} />

            </section>
        );
    }
}
