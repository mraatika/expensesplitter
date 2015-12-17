export default {

    SHEET_STORE_NAME: 'expensesplitter-sheets',
    SETTINGS_STORE_NAME: 'expensesplitter-settings',

    ErrorTypes: {
        SERVER_ERROR: Symbol()
    },

    ErrorEventTypes: {
        ADD_PARTICIPANT: Symbol(),
        ADD_EXPENSE: Symbol(),
        ADD_SHEET: Symbol(),
        LOAD_SHEET: Symbol(),
        SAVE_SHEET: Symbol(),
        REMOVE_SHEET: Symbol()
    },

    EventTypes: {
        ADD_EXPENSE_EVENT: Symbol(),
        ADD_PARTICIPANT_EVENT: Symbol(),
        ADD_SHEET_EVENT: Symbol(),
        CHANGE_EVENT: Symbol(),
        LOAD_SHEET_SUCCESS: Symbol(),
        REMOVE_EXPENSE_EVENT: Symbol(),
        REMOVE_PARTICIPANT_EVENT: Symbol(),
        REMOVE_SHEET_EVENT: Symbol(),
        REMOVE_SHEET_SUCCESS: Symbol(),
        SET_ACTIVE_SHEET_EVENT: Symbol(),
        SETTINGS_CHANGED_EVENT: Symbol(),
        LANGUAGE_CHANGED_EVENT: Symbol(),
        SAVE_SHEET_SUCCESS: Symbol()
    },

    ActionTypes: {
        ADD_EXPENSE: Symbol(),
        ADD_PARTICIPANT: Symbol(),
        CREATE_SHEET: Symbol(),
        REMOVE_EXPENSE: Symbol(),
        REMOVE_PARTICIPANT: Symbol(),
        REMOVE_ALL_EXPENSES: Symbol(),
        REMOVE_SHEET: Symbol(),
        SET_ACTIVE_SHEET: Symbol(),
        SET_SHEET_SETTINGS: Symbol(),
        SET_LANGUAGE: Symbol(),
        SAVE_SHEET: Symbol()
    },

    ActionSources: {
        SERVER_ACTION: Symbol(),
        VIEW_ACTION: Symbol()
    },

    Languages: {
        EN: 'en',
        FI: 'fi'
    }
};
