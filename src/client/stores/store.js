import {createStore, applyMiddleware} from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import rootReducer from 'client/stores/rootreducer';

const client = axios.create({
    baseURL:'http://localhost:4932/api',
    responseType: 'json',
    timeout: 10000
});

const middleware = [
    thunkMiddleware,
    axiosMiddleware(client)
];

// only use logging on development
if (process.env.NODE_ENV !== 'prod') middleware.push(require('redux-logger')());

/**
 * Applcation state store factory
 * @param  {Object} preloadedState
 * @return {Store}
 */
const sheetStore = function sheetStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(...middleware)
    );
};

export default sheetStore();
