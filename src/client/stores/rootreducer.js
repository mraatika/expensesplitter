import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {sheetReducer} from 'stores/sheetreducer';
import {sheetHistoryReducer} from 'stores/sheethistoryreducer';
import {settingsReducer} from 'stores/settingsreducer';
import {notificationsReducer} from 'stores/notificationsreducer';
import {uiReducer} from 'stores/uireducer';

export default combineReducers({
    sheet: sheetReducer,
    notifications: notificationsReducer,
    sheetHistory: sheetHistoryReducer,
    settings: settingsReducer,
    routing: routerReducer,
    ui: uiReducer
});