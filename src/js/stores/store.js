/*

    case Constants.ErrorEventTypes.REMOVE_SHEET:
        restoreSheet(action.sheet);
*/

import {createStore, applyMiddleware, combineReducers} from 'redux';
import {browserHistory} from 'react-router';
import {routerMiddleware, routerReducer} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {sheet} from 'stores/sheetreducer';
import {sheetHistory} from 'stores/sheethistoryreducer';
import {settings} from 'stores/settingsreducer';
import {notifications} from 'stores/notificationsreducer';

const loggerMiddleware = createLogger();

/**
 * Applcation state store factory
 * @param  {Object} preloadedState
 * @return {Store}
 */
const sheetStore = function sheetStore(preloadedState) {
    return createStore(
        combineReducers({
            sheet,
            notifications,
            sheetHistory,
            settings,
            routing: routerReducer
        }),
        preloadedState,
        applyMiddleware(
            routerMiddleware(browserHistory),
            thunkMiddleware,
            loggerMiddleware
        )
    );
};

export default sheetStore();
