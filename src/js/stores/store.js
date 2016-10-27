import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {browserHistory} from 'react-router';
import rootReducer from 'stores/rootreducer';

/**
 * Applcation state store factory
 * @param  {Object} preloadedState
 * @return {Store}
 */
const sheetStore = function sheetStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            routerMiddleware(browserHistory),
            thunkMiddleware,
            createLogger()
        )
    );
};

export default sheetStore();
