/**
 * All navigable pages with link hrefs and translatable names
 * @type {Object}
 */
export default Object.freeze({

    HOME: {
        href: '/',
        label: 'lang.home',
        displayInNavigation: true,
        next: 'PARTICIPANTS'
    },

    PARTICIPANTS: {
        href: '/participants',
        label: 'lang.participant_plural',
        displayInNavigation: true,
        next: 'EXPENSES',
        prev: 'HOME'
    },

    EXPENSES: {
        href: '/expenses',
        label: 'lang.expense_plural',
        displayInNavigation: true,
        next: 'SUMMARY',
        prev: 'PARTICIPANTS'
    },

    SUMMARY: {
        href: '/summary',
        label: 'lang.summary',
        displayInNavigation: true,
        prev: 'EXPENSES'
    }
});