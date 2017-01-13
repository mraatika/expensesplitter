import {ascend, find, filter, map, pipe, pluck, prop, propEq, sortBy, sortWith, sum} from 'ramda';

/**
 * Get a filtering function
 * @private
 * @param  {Array} expenses
 * @return {Function}
 */
function expenseFilterer(expenses = []) {
    // return a function that takes a filtering function and it's parameters as an input
    // applies expense and given arguments to the filtering function
    return (fn, ...restArgs) => expenses.filter(e => fn.apply(null, [e].concat(restArgs)));
}

/**
 * Check if participant is payer of given expense
 * @private
 * @param  {Object} expense
 * @param  {String} participantId
 * @return {Boolean}
 */
function isPayer(expense, participantId) {
    return expense.payer === participantId;
}

/**
 * Check if participant is participated in given expense
 * @private
 * @param  {Object} expense
 * @param  {String} participantId
 * @return {Boolean}
 */
function isParticipant(expense, participantId) {
    return expense.participants.indexOf(participantId) > -1;
}

/**
 * PUBLIC API
 *
 */

/**
 * Calculate balance for each participant.
 * @param {Object} sheet
 * @returns {Array} An array of objects
 *     {string} participant
 *     {number} balance
 *
 */
export function calculateBalances(sheet) {
    const {expenses, participants} = sheet;

    return pipe(
        map(p => ({ participant: p.id, balance: calculateParticipantBalance(p.id, expenses)})),
        sortBy(prop('balance'))
    )(participants);
}

/**
 * Returns the current balance of a participant (share - paid)
 * @param {string} participantId
 * @returns {number}
 */
export function calculateParticipantBalance(participantId, expenses) {
    const total = calculateParticipantShare(participantId, expenses);
    const paid = calculateParticipantTotalPaid(participantId, expenses);

    return total - paid;
}

/**
 * Calculates participant's share of expenses
 * @param {string} participantId
 * @returns {number} The sum of expenses
 */
export function calculateParticipantShare(participantId, expenses) {
    return pipe(
        expenseFilterer(expenses),
        map(e => e.price / e.participants.length),
        sum()
    )(isParticipant, participantId);
}

/**
 * Returns the total sum paid
 * @param {string} participantId
 * @returns {number}
 */
export function calculateParticipantTotalPaid(participantId, expenses) {
    return pipe(
        expenseFilterer(expenses),
        getTotalSum
    )(isPayer, participantId);
}

/**
 * Return the total sum of all the expenses
 * @returns {number} The total sum
 */
export function getTotalSum(expenses = []) {
    return pipe(
        pluck('price'),
        map(p => +p || 0),
        sum
    )(expenses);
}

/**
 * Get expeneses of a participant
 * @param {string} participantId Participant's id
 * @return {Array}
 */
export function findExpensesByParticipant(participantId) {
    return filter(e => isParticipant(e, participantId));
}

/**
 * Find expenses paid by a participant
 * @param  {string} participantId
 * @return {Array} An array of expenses
 */
export function findExpensesPaidByParticipant(participantId) {
    return filter(e => isPayer(e, participantId));
}

/**
 * Find expenses paid or participated by a participant
 * @param  {string} participantId
 * @return {Array} An array of expenses
 */
export function findAllExpensesOfParticipant(participantId) {
    return filter(e => isParticipant(e, participantId) || isPayer(e, participantId));
}

/**
 * Calculate all balances and shares
 * @return {Array}
 */
export function getAllBalancesAndShares(sheet) {
    const {expenses, participants} = sheet;

    return pipe(
        calculateBalances,
        map(balance => {
            return {
                participantId: balance.participant,
                participantName: find(propEq('id', balance.participant))(participants).name,
                balance: balance.balance,
                amount: calculateParticipantShare(balance.participant, expenses)
            };
        }),
        sortWith([
            ascend(prop('balance')),
            ascend(prop('participantName'))
        ])
    )(sheet);
}