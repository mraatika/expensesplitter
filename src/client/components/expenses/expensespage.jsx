import React, {PropTypes} from 'react';
import pages from 'client/constants/pages';
import {t} from 'common/dictionary/dictionary';
import Navigation from 'client/components/navigation/navigation.jsx';
import ExpenseAddForm from 'client/components/expenses/expenseaddform.jsx';
import ExpenseList from 'client/components/expenses/expenselist.jsx';
import SharesTable from 'client/components/shares/sharestable.jsx';

/**
 * @class ExpensesPage
 * @description Main level Controller view for the expenses page.
 */
class ExpensesPage extends React.Component {
    /**
     * @return {ReactComponent}
     */
    render() {
        const {sheet, expenses, participants} = this.props;

        return (
            <section id="expenses-page">
                <section className="row">
                    <div className="expenses-list eight columns">
                        <h2>{ t('lang.expense_plural') }</h2>
                        <ExpenseList
                            expenses={expenses}
                            participants={participants}
                            isRemoveAllowed={true}
                            removeExpenses={this.props.removeExpenses}
                            currencySymbol={sheet.settings.currencySymbol}/>
                    </div>
                    <div className="four columns">
                        <aside role="complementary" className="shares-section-container">
                            <h2>{ t('lang.share_plural') }</h2>
                            <SharesTable
                                participants={participants}
                                expenses={expenses}
                                currencySymbol={sheet.settings.currencySymbol}/>
                        </aside>
                    </div>
                </section>

                <section className="clear-float">
                    <ExpenseAddForm
                        participants={participants}
                        onSubmit={this.props.addExpense}
                        currencySymbol={sheet.settings.currencySymbol}/>
                </section>

                <Navigation currentPage={pages.EXPENSES} sheetId={sheet.id}/>

            </section>
        );
    }
}

ExpensesPage.propTypes = {
    sheet: PropTypes.object.isRequired,
    expenses: PropTypes.array.isRequired,
    participants: PropTypes.array.isRequired,
    addExpense: PropTypes.func.isRequired,
    removeExpenses: PropTypes.func.isRequired
};

export default ExpensesPage;