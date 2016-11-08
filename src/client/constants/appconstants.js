export default {

    SHEET_STORE_NAME                : 'expensesplitter-sheets',
    SETTINGS_STORE_NAME             : 'expensesplitter-settings',

    ErrorEventTypes: {
        ADD_SHEET                   : 'ADD_SHEET_FAIL',
        LOAD_SHEET                  : 'LOAD_SHEET_FAIL',
        SAVE_SHEET                  : 'SAVE_SHEET_FAIL',
        REMOVE_SHEET                : 'REMOVE_SHEET_FAIL'
    },

    EventTypes: {
        CREATE_SHEET_SUCCESS        : 'CREATE_SHEET_SUCCESS',
        LOAD_SHEET_SUCCESS          : 'LOAD_SHEET_SUCCESS',
        REMOVE_SHEET_SUCCESS        : 'REMOVE_SHEET_SUCCESS',
        SAVE_SHEET_SUCCESS          : 'SAVE_SHEET_SUCCESS'
    },

    ActionTypes: {
        CLEAR_HISTORY               : 'CLEAR_HISTORY',
        CREATE_SHEET                : 'CREATE_SHEET',
        LOAD_SHEET                  : 'LOAD_SHEET',
        REMOVE_SHEET                : 'REMOVE_SHEET',
        REMOVE_SHEET_HISTORY_ENTRY  : 'REMOVE_SHEET_HISTORY_ENTRY',
        SET_SETTINGS                : 'SET_SETTINGS',
        SAVE_SHEET                  : 'SAVE_SHEET',
        TOGGLE_LOAD_SHEET_DIALOG    : 'TOGGLE_LOAD_SHEET_DIALOG',
        TOGGLE_NEW_SHEET_MESSAGE    : 'TOGGLE_NEW_SHEET_MESSAGE',
        TOGGLE_SETTINGS_SECTION    : 'TOGGLE_SETTINGS_SECTION',
        UPDATE_SHEET                : 'UPDATE_SHEET'
    },

    Languages: {
        EN: 'en',
        FI: 'fi'
    }
};
