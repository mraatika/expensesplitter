import {combineReducers} from 'redux';
import sheetReducer from 'client/stores/sheetreducer';
import sheetHistoryReducer from 'client/stores/sheethistoryreducer';
import settingsReducer from 'client/stores/settingsreducer';
import notificationsReducer from 'client/stores/notificationsreducer';
import uiReducer from 'client/stores/uireducer';
import participantsReducer from 'client/stores/participantsreducer';
import expensesReducer from 'client/stores/expensesreducer';

export default combineReducers({
    expenses: expensesReducer,
    notifications: notificationsReducer,
    participants: participantsReducer,
    settings: settingsReducer,
    sheet: sheetReducer,
    sheetHistory: sheetHistoryReducer,
    ui: uiReducer
});