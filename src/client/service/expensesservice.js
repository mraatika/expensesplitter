import R from 'ramda';
import {ArrayUtils} from 'client/util/utils';

/**
 * Reject values that can't be converted to a number
 * @private
 * @param  {*} num
 * @return {Function}
 *         @param {Array}
 *         @return {Array} filtered values
 */
const rejectNaNs = R.reject(num => isNaN(+num));

/**
 * Calculate sum converting values to numbers with NaN check
 * @private
 * @param  {Array[Number]} A iterable list of numbers
 * @return {Function}
 *         @param {Array}
 *         @return {Number}
 */
const safeSum = R.pipe(rejectNaNs, R.sum);

/**
 * Return the summed up price of all the expenses
 * @param {Array}
 * @returns {Number}
 */
export const getTotalSum = R.pipe(R.pluck('price'), safeSum);

/**
 * Filter expenses list using a filtering function
 * @param  {Function} fn
 * @param  {Array} expenses
 * @return {Array}
 */
const filterExpensesBy = (fn, expenses) => R.filter(fn)(expenses);

/**
 * Check if given participant id is found in expense's participants list
 * @param  {String} participantId
 * @return {Function}
 *         @param {Object} expense
 *         @return {Boolean}
 */
const isParticipant = participantId => expense => expense.participants.indexOf(participantId) > -1;

/**
 * Get expeneses of a participant
 * @param  {Array[Object]} An array of expense objects
 * @return {Array[Object]}
 */
export const findExpensesByParticipant = expenses => id => filterExpensesBy(isParticipant(id), expenses);

/**
 * Partial fn to check if given value equals the payer property of an applied object
 * @type {Function}
 * @param {String} id
 * @return {Boolean}
 */
const isPayer = R.partial(R.propEq, ['payer']);

/**
 * Find expenses paid by a participant
 * @param  {Array[Object]} An array of expense objects
 * @return {Array[Object]}
 */
export const findExpensesPaidByParticipant = expenses => id => filterExpensesBy(isPayer(id), expenses);

/**
 * Find expenses paid or participated by a participant
 * @param  {Array[Object]} An array of expense objects
 * @return {Array[Object]}
 */
export const findAllExpensesOfParticipant = expenses => id => filterExpensesBy(R.either(isPayer(id), isParticipant(id)), expenses);


/**
 * Calculates participant's share of expenses
 * @param {Array[Object]} expenses
 * @returns {Number}
 */
export const calculateParticipantShare = (expenses) => {
    return R.pipe(
        findExpensesByParticipant(expenses),
        R.map(e => e.price / e.participants.length),
        safeSum
    );
};

/**
 * Returns the total sum paid
 * @param {Array[Object]} expenses
 * @returns {Number}
 */
export const calculateParticipantTotalPaid = (expenses) => {
    return R.pipe(
        findExpensesPaidByParticipant(expenses),
        getTotalSum
    );
};


/**
 * Returns the current balance of a participant (share - paid)
 * @param {String} participantId
 * @param {Array[Object]} expenses
 * @returns {Number}
 */
export const calculateParticipantBalance = (participantId, expenses) => {
    const share = calculateParticipantShare(expenses)(participantId);
    const paid = calculateParticipantTotalPaid(expenses)(participantId);

    return share - paid;
};


/**
 * Calculate balance for each participant.
 * @param {Object} sheet
 * @returns {Array} An array of objects
 *     {String} participant
 *     {Number} balance
 */
export const calculateBalances = (sheet) => {
    const {expenses, participants} = sheet;

    return R.pipe(
        R.map(p => ({ participant: p.id, balance: calculateParticipantBalance(p.id, expenses)})),
        R.sortBy(R.prop('balance'))
    )(participants);
};

/**
 * Partial for checking if id property of an applied object matches a given value
 * @type {Function}
 * @param {String}
 * @return {Boolean}
 */
const isIdEqual = R.partial(R.propEq, ['id']);
/**
 * Find an object from a list by it's id
 * @param  {Array[Object]} list
 * @return {Function}
 *         @param {String} id
 *         @return {Object}
 */
const findByIdFromList = list => id => R.find(isIdEqual(id))(list);

/**
 * Calculate all balances and shares
 * @param {Object} sheet
 * @return {Array[Object]}
 *         {String} participantId
 *         {String} participantName
 *         {Number} balance
 *         {Number} amount
 */
export const getAllBalancesAndShares = (sheet) => {
    const {expenses, participants} = sheet;
    const findParticipantById = R.pipe(findByIdFromList(participants), R.prop('name'));
    const shareCalculator = calculateParticipantShare(expenses);

    return R.pipe(
        calculateBalances,
        R.map(balanceObj => {
            const {participant, balance} = balanceObj;
            return {
                participantId: participant,
                participantName: findParticipantById(participant),
                balance: balance,
                amount: shareCalculator(participant)
            };
        }),
        R.partialRight(ArrayUtils.sortAscByProps, [['balance', 'participantName']])
    )(sheet);
};