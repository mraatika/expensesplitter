export default {

    SHEET_STORE_NAME: 'expensesplitter-sheets',
    SETTINGS_STORE_NAME: 'expensesplitter-settings',

    ErrorEventTypes: {
        ADD_SHEET: 'ADD_SHEET_ERROR',
        LOAD_SHEET: 'LOAD_SHEET_ERROR',
        SAVE_SHEET: 'SAVE_SHEET_ERROR',
        REMOVE_SHEET: 'REMOVE_SHEET_ERROR'
    },

    EventTypes: {
        CREATE_SHEET_SUCCESS: 'CREATE_SHEET_SUCCESS',
        LOAD_SHEET_SUCCESS: 'LOAD_SHEET_SUCCESS',
        REMOVE_SHEET_SUCCESS: 'REMOVE_SHEET_SUCCESS',
        SAVE_SHEET_SUCCESS: 'SAVE_SHEET_SUCCESS'
    },

    ActionTypes: {
        CLEAR_HISTORY: 'CLEAR_HISTORY',
        CREATE_SHEET: 'CREATE_SHEET',
        REMOVE_SHEET: 'REMOVE_SHEET',
        REQUEST_SHEET: 'REQUEST_SHEET',
        SET_SETTINGS: 'SET_SETTINGS',
        SAVE_SHEET: 'SAVE_SHEET',
        UPDATE_SHEET: 'UPDATE_SHEET'
    },

    Languages: {
        EN: 'en',
        FI: 'fi'
    }
};
