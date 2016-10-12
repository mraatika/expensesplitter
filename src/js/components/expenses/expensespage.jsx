import React from 'react';
import pages from '../../constants/pages';
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
     * @return {ReactComponent}
     */
    render() {
        const {sheet} = this.props;

        console.log(this.props);

        return (
            <section id="expenses-page">
                <section className="row">
                    <div className="expenses-list eight columns">
                        <h2>{ t('lang.expense_plural') }</h2>
                        <ExpenseList
                            sheet={sheet}
                            expenses={sheet.expenses}
                            participants={sheet.participants}
                            isRemoveAllowed={true}
                            removeExpenses={expenses => this.props.removeExpenses(sheet, expenses)}
                            currencySymbol={sheet.settings.currencySymbol}/>
                    </div>
                    <div className="four columns">
                        <aside role="complementary" className="shares-section-container">
                            <SharesSection expenses={sheet.expenses} participants={sheet.participants} />
                        </aside>
                    </div>
                </section>

                <section className="clear-float">
                    <ExpenseAddForm
                        participants={sheet.participants}
                        onSubmit={expense => this.props.addExpense(this.props.sheet, expense)}
                        currencySymbol={sheet.settings.currencySymbol}/>
                </section>

                <Navigation currentPage={pages.EXPENSES} sheetId={sheet.id}/>

            </section>
        );
    }
}
