import React, {PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
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
class ExpenseSplitterRouter extends React.Component {

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={AppContainer}>
                    <IndexRoute component={HomePageContainer} />

                    <Route path="/sheet/:sheetId(/admin/:adminKey)">
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

ExpenseSplitterRouter.propTypes = {
    store: PropTypes.object.isRequired
};

export default ExpenseSplitterRouter;