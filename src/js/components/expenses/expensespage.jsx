import React from 'react';
import ExpenseStore from '../../stores/expensestore.js';
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
        this.state = { expenses: this._fetchExpenses() };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ExpenseStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ExpenseStore.removeChangeListener(this._onChange);
    }

    /**
     * Fetch all sheet's expenses from expense store
     * @private
     * @return  {array}
     */
    _fetchExpenses() {
        return ExpenseStore.getExpenses(this.props.currentSheet.id);
    }

    /**
     * Sheet change listener. Sets sheet to state.
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState({ expenses: this._fetchExpenses() });
    }

    /**
     * Add new expense to expense store
     * @private
     * @param   {Object} expense
     * @return {undefined}
     */
    _addExpense(expense) {
        ActionCreators.addExpense(expense, this.props.currentSheet.id);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const sheet = this.props.currentSheet;
        const {participants} = this.props;

        return (
            <section id="expenses-page">
                <section className="row">
                    <div className="expenses-list eight columns">
                        <h2>{ t('lang.expense_plural') }</h2>
                        <ExpenseList
                            sheet={sheet}
                            expenses={this.state.expenses}
                            participants={participants}
                            isRemoveAllowed={true}
                            settings={sheet.settings}/>
                    </div>
                    <div className="four columns">
                        <aside role="complementary" className="shares-section-container">
                            <SharesSection expenses={this.state.expenses} participants={participants} />
                        </aside>
                    </div>
                </section>

                <section className="clear-float">
                    <ExpenseAddForm
                        participants={participants}
                        expenses={this.state.expenses}
                        onSubmit={this._addExpense.bind(this)}
                        currencySymbol={sheet.settings.currencySymbol}/>
                </section>

                <Navigation currentPage={pages.EXPENSES} />

            </section>
        );
    }
}
