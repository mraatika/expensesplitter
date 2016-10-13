export const Sheet = {
    id: {
        type: 'string',
        required: true
    },

    name: {
        type: 'string',
        required: true,
        maxLength: 100,
        msgKey: 'error.sheet.name'
    },

    additionalInformation: {
        type: 'string'
    },

    participants: {
        type: 'array'
    },

    expenses: {
        type: 'array'
    },

    settings: {
        type: 'object'
    }
};

export const Participant = {
    id: {
        required: true,
        type: 'string'
    },

    name: {
        required: true,
        type: 'string',
        maxLength: 100,
        msgKey: 'error.participant.name'
    }
};

export const Expense = {
    id: {
        required: true,
        type: 'string'
    },

    name: {
        required: true,
        type: 'string',
        maxLength: 100,
        msgKey: 'error.expense.name'
    },

    price: {
        required: true,
        type: 'decimal',
        min: 0.1,
        max: 1000000,
        msgKey: 'error.expense.price'
    },

    participants: {
        required: true,
        type: 'array',
        minLength: 1,
        msgKey: 'error.expense.participants'
    },

    payer: {
        required: true
    }
};

export default {
    Sheet: Sheet,
    Participant: Participant,
    Expense: Expense
};