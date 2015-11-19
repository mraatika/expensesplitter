'use strict';

/**
 * All navigable pages with link hrefs and translatable names
 * @type {Object}
 */
export default Object.freeze({

    HOME: {
        href: '/',
        label: 'lang.home',
        displayInNavigation: true
    },

    PARTICIPANTS: {
        href: '/participants',
        label: 'lang.participant_plural',
        displayInNavigation: true
    },

    EXPENSES: {
        href: '/expenses',
        label: 'lang.expense_plural',
        displayInNavigation: true
    },

    TRANSACTIONS: {
        href: '/transactions',
        label: 'lang.transaction_plural',
        displayInNavigation: true
    },

    SUMMARY: {
        href: '/summary/static',
        label: 'lang.summary',
        displayInNavigation: false
    }
});