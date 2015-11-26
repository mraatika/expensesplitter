export default {

    STORE_NAME: 'expensesplitter',

    ErrorEventTypes: {
        ADD_PARTICIPANT: Symbol(),
        ADD_EXPENSE: Symbol(),
        ADD_SHEET: Symbol(),
        ERROR_EVENT: Symbol()
    },

    EventTypes: {
        ADD_EXPENSE_EVENT: Symbol(),
        ADD_PARTICIPANT_EVENT: Symbol(),
        ADD_SHEET_EVENT: Symbol(),
        CHANGE_EVENT: Symbol(),
        REMOVE_EXPENSE_EVENT: Symbol(),
        REMOVE_PARTICIPANT_EVENT: Symbol(),
        REMOVE_SHEET_EVENT: Symbol(),
        SET_ACTIVE_SHEET_EVENT: Symbol(),
        SETTINGS_CHANGED_EVENT: Symbol(),
        LANGUAGE_CHANGED_EVENT: Symbol()
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
        SET_SETTINGS: Symbol(),
        SET_LANGUAGE: Symbol()
    },

    ActionSources: {
        SERVER_ACTION: Symbol(),
        VIEW_ACTION: Symbol()
    },

    Languages: {
        FI: 'fi',
        EN: 'en'
    }
};
