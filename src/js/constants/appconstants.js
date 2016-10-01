export default {

    SHEET_STORE_NAME: 'expensesplitter-sheets',
    SETTINGS_STORE_NAME: 'expensesplitter-settings',

    ErrorTypes: {
        SERVER_ERROR: Symbol('SERVER_ERROR')
    },

    ErrorEventTypes: {
        ADD_PARTICIPANT: Symbol('ADD_PARTICIPANT'),
        ADD_EXPENSE: Symbol('ADD_EXPENSE'),
        ADD_SHEET: Symbol('ADD_SHEET'),
        LOAD_SHEET: Symbol('LOAD_SHEET'),
        SAVE_SHEET: Symbol('SAVE_SHEET'),
        REMOVE_SHEET: Symbol('REMOVE_SHEET')
    },

    EventTypes: {
        ADD_EXPENSE_EVENT: Symbol('ADD_EXPENSE_EVENT'),
        ADD_PARTICIPANT_EVENT: Symbol('ADD_PARTICIPANT_EVENT'),
        CHANGE_EVENT: Symbol('CHANGE_EVENT'),
        CREATE_SHEET_SUCCESS: Symbol('CREATE_SHEET_SUCCESS'),
        LOAD_SHEET_SUCCESS: Symbol('LOAD_SHEET_SUCCESS'),
        REMOVE_EXPENSE_EVENT: Symbol('REMOVE_EXPENSE_EVENT'),
        REMOVE_PARTICIPANT_EVENT: Symbol('REMOVE_PARTICIPANT_EVENT'),
        REMOVE_SHEET_EVENT: Symbol('REMOVE_SHEET_EVENT'),
        REMOVE_SHEET_SUCCESS: Symbol('REMOVE_SHEET_SUCCESS'),
        SET_ACTIVE_SHEET_EVENT: Symbol('SET_ACTIVE_SHEET_EVENT'),
        SETTINGS_CHANGED_EVENT: Symbol('SETTINGS_CHANGED_EVENT'),
        LANGUAGE_CHANGED_EVENT: Symbol('LANGUAGE_CHANGED_EVENT'),
        SAVE_SHEET_SUCCESS: Symbol('SAVE_SHEET_SUCCESS')
    },

    ActionTypes: {
        ADD_EXPENSE: Symbol('ADD_EXPENSE'),
        ADD_PARTICIPANT: Symbol('ADD_PARTICIPANT'),
        CLEAR_HISTORY: Symbol('CLEAR_HISTORY'),
        CREATE_SHEET: Symbol('CREATE_SHEET'),
        REMOVE_EXPENSE: Symbol('REMOVE_EXPENSE'),
        REMOVE_PARTICIPANT: Symbol('REMOVE_PARTICIPANT'),
        REMOVE_ALL_EXPENSES: Symbol('REMOVE_ALL_EXPENSES'),
        REMOVE_SHEET: Symbol('REMOVE_SHEET'),
        SET_ACTIVE_SHEET: Symbol('SET_ACTIVE_SHEET'),
        SET_SHEET_SETTINGS: Symbol('SET_SHEET_SETTINGS'),
        SET_LANGUAGE: Symbol('SET_LANGUAGE'),
        SAVE_SHEET: Symbol('SAVE_SHEET')
    },

    ActionSources: {
        SERVER_ACTION: Symbol('SERVER_ACTION'),
        VIEW_ACTION: Symbol('VIEW_ACTION')
    },

    Languages: {
        EN: 'en',
        FI: 'fi'
    }
};
