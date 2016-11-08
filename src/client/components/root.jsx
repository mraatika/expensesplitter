import React from 'react'; // eslint-disable-line no-unused-vars
import {Provider} from 'react-redux';
import ExpenseSplitterRouter from 'client/router/expensesplitterrouter.jsx';
import sheetStore from 'client/stores/store';

/**
 * @class Root
 * @description Root component that gets mounted in the index.jsx
 * @extends {React.Component}
 */
class Root extends React.Component {
    render() {
        return (
            <Provider store={sheetStore}>
                <ExpenseSplitterRouter store={sheetStore}/>
            </Provider>
        );
    }
}

export default Root;