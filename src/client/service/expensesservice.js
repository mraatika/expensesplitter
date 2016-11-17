import {sortBy} from 'lodash';
import {ArrayUtils} from 'client/util/utils';

/**
 * @class ExpensesService
 * @description Service for calculations related to expenses
 */
export default class ExpensesService {

    /**
     * @constructor
     * @param {Object} sheet
     */
    constructor(sheet) {
        this.sheet = sheet;
    }

    /**
     * Calculate balance for each participant.
     * @param {Array} expenses
     * @param {Array} participants
     * @returns {Array} An array of objects
     *     {string} participant
     *     {number} balance
     *
     */
    calculateBalances() {
        const {expenses, participants} = this.sheet;
        const balances = participants.map(participant => {
            return {
                participant: participant.id,
                balance: this.calculateParticipantBalance(participant.id, expenses)
            };
        });

        return sortBy(balances, 'balance');
    }

    /**
     * Returns the current balance of a participant (share - paid)
     * @param {string} participantId
     * @returns {number}
     */
    calculateParticipantBalance(participantId) {
        const {expenses} = this.sheet;
        const total = this.calculateParticipantShare(participantId, expenses);
        const paid = this.calculateParticipantTotalPaid(participantId, expenses);

        return total - paid;
    }

    /**
     * Calculates participant's share of expenses
     * @param {string} participantId
     * @returns {number} The sum of expenses
     */
    calculateParticipantShare(participantId) {
        const {expenses} = this.sheet;

        return expenses.reduce((sum, expense) => {
            // expense's participants
            const participants = expense.participants || [],
                price = +expense.price || 0;

            // if price is invalid, zero or the participant given
            // in parameters hasn't participated in this expense
            if (!price || participants.indexOf(participantId) === -1) {
                return sum;
            }

            return sum + (price / participants.length);

        }, 0);
    }

    /**
     * Returns the total sum paid
     * @param {string} participantId
     * @returns {number}
     */
    calculateParticipantTotalPaid(participantId) {
        const {expenses} = this.sheet;

        return expenses.reduce((sum, expense) => {
            // expense's participants
            const payer = expense.payer;
            const price = +expense.price;

            // if price is invalid, zero or the participant given
            // in parameters hasn't participated in this expense
            if (!price || payer !== participantId) {
                return sum;
            }

            return sum + price;

        }, 0);
    }

    /**
     * Return the total sum of all the expenses
     * @returns {number} The total sum
     */
    getTotalSum() {
        const {expenses} = this.sheet;

        return expenses.reduce((sum, expense) => {
            return sum + (+expense.price || 0);
        }, 0);
    }

    /**
     * Get expeneses of a participant
     * @param {string} participantId Participant's id
     * @return {Array}
     */
    findExpensesByParticipant(participantId) {
        const {expenses} = this.sheet;
        return expenses.filter(expense => expense.participants.indexOf(participantId) > -1);
    }

    /**
     * Find expenses paid by a participant
     * @param  {string} participantId
     * @return {Array} An array of expenses
     */
    findExpensesPaidByParticipant(participantId) {
        const {expenses} = this.sheet;
        return expenses.filter(expense => expense.payer === participantId);
    }

    /**
     * Find expenses paid or participated by a participant
     * @param  {string} participantId
     * @return {Array} An array of expenses
     */
    findAllExpensesOfParticipant(participantId) {
        const {expenses} = this.sheet;
        return expenses.filter(e => e.payer === participantId || e.participants.indexOf(participantId) > -1);
    }

    /**
     * Calculate all balances and shares
     * @return {Array}
     */
    getAllBalancesAndShares() {
        const {expenses, participants} = this.sheet;
        const balances = this.calculateBalances(expenses, participants);

        return balances.map(balance => {
            return {
                participantId: balance.participant,
                participantName: ArrayUtils.findById(participants, balance.participant).name,
                balance: balance.balance,
                amount: this.calculateParticipantShare(
                    balance.participant, expenses
                )
            };
        });
    }
}