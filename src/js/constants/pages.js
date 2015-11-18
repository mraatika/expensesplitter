'use strict';

/**
 * All navigable pages with link hrefs and translatable names
 * @type {Object}
 */
export default Object.freeze({

    HOME: {
        href: '/',
        label: 'lang.home'
    },

    PARTICIPANTS: {
        href: '/participants',
        label: 'lang.participant_plural'
    },

    EXPENSES: {
        href: '/expenses',
        label: 'lang.expense_plural'
    },

    TRANSACTIONS: {
        href: '/transactions',
        label: 'lang.transaction_plural'
    }
});