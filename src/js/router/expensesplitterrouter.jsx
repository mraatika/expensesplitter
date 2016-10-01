import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import App from '../components/app.jsx';
import HomePage from '../components/home/homepage.jsx';
import ParticipantsPage from '../components/participants/participantspage.jsx';
import ExpensesPage from '../components/expenses/expensespage.jsx';
import TransactionsPage from '../components/transactions/transactionspage.jsx';
import SummaryPage from '../components/summary/summarypage.jsx';

/**
 * @class ExpenseSplitterRouter
 * @description Wrapper component for React Router
 * @extends {React.Component}
 */
export default class ExpenseSplitterRouter extends React.Component {

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={HomePage} />

                    <Route path="/sheet/:sheetId">
                        <IndexRoute component={HomePage} />
                        <Route path="participants" component={ParticipantsPage} />
                        <Route path="expenses" component={ExpensesPage} />
                        <Route path="transactions" component={TransactionsPage} />
                        <Route path="summary" component={SummaryPage} />
                    </Route>
                </Route>
            </Router>
        );
    }
}