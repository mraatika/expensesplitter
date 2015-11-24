import React from 'react';
import DataStore from '../../stores/datastore';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import {Navigation} from '../navigation/navigation.jsx';
import ExpenseAddForm from './expenseaddform.jsx';
import {ExpenseList} from './expenselist.jsx';
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
        this.state = { currentSheet: this.props.currentSheet };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        DataStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        DataStore.removeChangeListener(this._onChange);
    }

    /**
     * Sheet change listener. Sets sheet to state.
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState({ currentSheet: DataStore.getCurrentSheet() });
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const sheet = this.state.currentSheet;

        return (
            <section id="expenses-page">
                <section className="row">
                    <div className="expenses-list eight columns">
                        <h1>{ t('lang.expense_plural') }</h1>
                        <ExpenseList
                            expenses={sheet.expenses}
                            participants={sheet.participants}
                            isRemoveAllowed={true}
                            settings={sheet.settings}/>
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
                        expenses={sheet.expenses}
                        currencySymbol={sheet.settings.currencySymbol}/>
                </section>

                <Navigation
                    prev={pages.PARTICIPANTS}
                    next={pages.TRANSACTIONS} />
            </section>
        );
    }
}
