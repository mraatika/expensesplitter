'use strict';

import React from 'react';
import DataStore from '../../stores/datastore';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import {Navigation} from '../navigation.jsx';
import {ExpenseAddForm} from './expenseaddform.jsx';
import {ExpenseList} from './expenselist.jsx';
import {SharesSection} from '../shares/sharessection.jsx';

/**
 * @class ExpensesPage
 * @description Main level Controller view for the expenses page.
 */
export class ExpensesPage extends React.Component {

    /**
     * @constructor
     * @param  {Object} props
     *     {Object} sheet
     */
    constructor(props) {
        super(props);
        this.state = { currentSheet: null };
        this._onChange = this._onChange.bind(this);
    }

    /**
     * Sheet change listener. Sets sheet to state.
     */
    _onChange() {
        this.setState({ currentSheet: DataStore.getCurrentSheet() });
    }

    componentDidMount() {
        DataStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        DataStore.removeChangeListener(this._onChange);
    }

    render() {
        var sheet = this.props.currentSheet;

        return (
            <section id="expenses-page">
                <section className="row">
                    <div className="expenses-list eight columns">
                        <h1>{ t('lang.expense_plural') }</h1>
                        <ExpenseList
                            expenses={sheet.expenses}
                            participants={sheet.participants}
                            isRemoveAllowed={true} />
                    </div>
                    <div className="four columns">
                        <aside role="complementary" className="shares-section-container">
                            <SharesSection expenses={sheet.expenses} participants={sheet.participants} />
                        </aside>
                    </div>
                </section>

                <section className="clear-float">
                    <ExpenseAddForm participants={sheet.participants} />
                </section>

                <Navigation
                    prev={pages.PARTICIPANTS}
                    next={pages.TRANSACTIONS} />
            </section>
        );
    }
}
