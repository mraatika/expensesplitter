import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from '../components/app.jsx';
import HomePage from '../components/home/homepage.jsx';
import ParticipantsPage from '../components/participants/participantspage.jsx';
import ExpensesPage from '../components/expenses/expensespage.jsx';
import TransactionsPage from '../components/transactions/transactionspage.jsx';
import SummaryPage from '../components/summary/summarypage.jsx';

export default class ExpenseSplitterRouter extends React.Component {

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={HomePage} />

                    <Route path="/sheet/:sheetId" component={HomePage} />
                    <Route path="/sheet/:sheetId/participants" component={ParticipantsPage} />
                    <Route path="/sheet/:sheetId/expenses" component={ExpensesPage} />
                    <Route path="/sheet/:sheetId/transactions" component={TransactionsPage} />
                    <Route path="/sheet/:sheetId/summary" component={SummaryPage} />
                </Route>
            </Router>
        );
    }
}