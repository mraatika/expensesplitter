import React from 'react';
import ExpenseStore from '../../stores/expensestore.js';
import SheetStore from '../../stores/sheetstore.js';
import ParticipantStore from '../../stores/participantstore.js';
import pages from '../../constants/pages';
import ActionCreators from '../..//actions/dataactioncreators';
import {t} from '../../dictionary/dictionary';
import Navigation from '../navigation/navigation.jsx';
import ExpenseAddForm from './expenseaddform.jsx';
import ExpenseList from './expenselist.jsx';
import SharesSection from '../shares/sharessection.jsx';

/**
 * @class ExpensesPage
 * @description Main level Controller view for the expenses page.
 */
export default class ExpensesPage extends React.Component {

    /**
     * @constructor
     * @param  {Object} props
     *     {Object} sheet
     */
    constructor(props) {
        super(props);
        this.state = this._formState(props);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ExpenseStore.addChangeListener(this._onChange);
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ExpenseStore.removeChangeListener(this._onChange);
        SheetStore.removeChangeListener(this._onChange);
    }

    _formState(props) {
        const currentSheet = SheetStore.getSheet(props.params.sheetId) || {};

        return {
            currentSheet: currentSheet,
            participants: ParticipantStore.getParticipants(currentSheet.id),
            expenses: ExpenseStore.getExpenses(currentSheet.id),
            settings: currentSheet.settings || {}
        };
    }

    /**
     * Sheet change listener. Sets sheet to state.
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState(this._formState(this.props));
    }

    /**
     * Add new expense to expense store
     * @private
     * @param   {Object} expense
     * @return {undefined}
     */
    _addExpense(expense) {
        ActionCreators.addExpense(expense, this.state.currentSheet.id);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {currentSheet, participants, expenses, settings} = this.state;

        return (
            <section id="expenses-page">
                <section className="row">
                    <div className="expenses-list eight columns">
                        <h2>{ t('lang.expense_plural') }</h2>
                        <ExpenseList
                            sheet={currentSheet}
                            expenses={expenses}
                            participants={participants}
                            isRemoveAllowed={true}
                            currencySymbol={settings.currencySymbol}/>
                    </div>
                    <div className="four columns">
                        <aside role="complementary" className="shares-section-container">
                            <SharesSection expenses={expenses} participants={participants} />
                        </aside>
                    </div>
                </section>

                <section className="clear-float">
                    <ExpenseAddForm
                        participants={participants}
                        onSubmit={this._addExpense.bind(this)}
                        currencySymbol={settings.currencySymbol}/>
                </section>

                <Navigation currentPage={pages.EXPENSES} sheetId={this.state.currentSheet.id}/>

            </section>
        );
    }
}
