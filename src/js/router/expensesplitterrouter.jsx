import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import AppContainer from 'containers/appcontainer';
import HomePageContainer from 'containers/homepagecontainer';
import ParticipantsPageContainer from 'containers/participantspagecontainer';
import ExpensesPageContainer from 'containers/expensespagecontainer';
import SummaryPageContainer from 'containers/summarypagecontainer';

/**
 * @class ExpenseSplitterRouter
 * @description Wrapper component for React Router
 * @extends {React.Component}
 */
export default class ExpenseSplitterRouter extends React.Component {

    /**
     * @constructor
     * @param       {Object} props
     * @return      {ExpenseSplitterRouter}
     */
    constructor(props) {
        super(props);
        // sync routing history with redux store
        this.history = syncHistoryWithStore(browserHistory, this.props.store);
    }

    render() {
        return (
            <Router history={this.history}>
                <Route path="/" component={AppContainer}>
                    <IndexRoute component={HomePageContainer} />

                    <Route path="/sheet/:sheetId">
                        <IndexRoute component={HomePageContainer} />
                        <Route path="participants" component={ParticipantsPageContainer} />
                        <Route path="expenses" component={ExpensesPageContainer} />
                        <Route path="summary" component={SummaryPageContainer} />
                    </Route>
                </Route>
            </Router>
        );
    }
}