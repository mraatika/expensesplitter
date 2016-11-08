import {combineReducers} from 'redux';
import {sheetReducer} from 'client/stores/sheetreducer';
import {sheetHistoryReducer} from 'client/stores/sheethistoryreducer';
import {settingsReducer} from 'client/stores/settingsreducer';
import {notificationsReducer} from 'client/stores/notificationsreducer';
import {uiReducer} from 'client/stores/uireducer';

export default combineReducers({
    sheet: sheetReducer,
    notifications: notificationsReducer,
    sheetHistory: sheetHistoryReducer,
    settings: settingsReducer,
    ui: uiReducer
});