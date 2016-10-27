import {createStore, applyMiddleware} from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import {routerMiddleware} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import axios from 'axios';
import {browserHistory} from 'react-router';
import rootReducer from 'stores/rootreducer';

const client = axios.create({
    baseURL:'http://localhost:4932/api',
    responseType: 'json',
    timeout: 10000
});

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
            axiosMiddleware(client),
            createLogger()
        )
    );
};

export default sheetStore();
