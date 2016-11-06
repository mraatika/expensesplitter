import {createStore, applyMiddleware} from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import axios from 'axios';
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
            thunkMiddleware,
            axiosMiddleware(client),
            createLogger()
        )
    );
};

export default sheetStore();
