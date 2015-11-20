import _ from 'lodash';

/**
 * @class ExpensesService
 * @description Service for calculations related to expenses
 */
export default class ExpensesService {

    /**
     * @constructor
     * @param {object} sheet
     */
    constructor(sheet) {
        this.sheet = sheet;
    }

    /**
     * Calculate balance for each participant.
     * @param {array} expenses
     * @param {array} participants
     * @returns {array} An array of objects
     *     {string} participant
     *     {number} balance
     *
     */
    calculateBalances(expenses = this.sheet.expenses, participants = this.sheet.participants) {
        return _.chain(participants)
            .map(participant => {
                return {
                    participant: participant.id,
                    balance: this.calculateParticipantBalance(participant.id, expenses)
                };
            })
            .sortBy(balance => balance.balance)
            .value();
    }

    /**
     * Returns the current balance of a participant (share - paid)
     * @param {array} expenses
     * @param {string} participantId
     * @returns {number}
     */
    calculateParticipantBalance(participantId, expenses = this.sheet.expenses) {
        const total = this.calculateParticipantShare(participantId, expenses);
        const paid = this.calculateParticipantTotalPaid(participantId, expenses);

        return total - paid;
    }

    /**
     * Calculates participant's share of expenses
     * @param {array} expenses
     * @param {string} participantId Participant's id
     * @returns {number} The sum of expenses
     */
    calculateParticipantShare(participantId, expenses = this.sheet.expenses) {
        return _.reduce(expenses, (sum, expense) => {
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
     * @param {array} expenses
     * @returns {number}
     */
    calculateParticipantTotalPaid(participantId, expenses = this.sheet.expenses) {
        return _.reduce(expenses, (sum, expense) => {
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
     * @param {array} expenses
     * @returns {number} The total sum
     */
    getTotalSum(expenses = this.sheet.expenses) {
        return _.reduce(expenses, (sum, expense) => {
            return sum + (+expense.price || 0);
        }, 0);
    }

    /**
     * Get expeneses of a participant
     *
     * @param {string} participantId Participant's id
     * @return {array} An array of expenses
     */
    findExpensesByParticipant(participantId, expenses = this.sheet.expenses) {
        return _.filter(expenses, expense => expense.participants.indexOf(participantId) > -1);
    }

    /**
     * Find expenses paid by a participant
     * @param  {string} participantId
     * @param  {array} expenses
     * @return {array} An array of expenses
     */
    findExpensesPaidByParticipant(participantId, expenses = this.sheet.expenses) {
        return _.filter(expenses, expense => expense.payer === participantId);
    }

    /**
     * Find expenses paid or participated by a participant
     * @param  {string} participantId
     * @param  {array} expenses
     * @return {array} An array of expenses
     */
    findAllExpensesOfParticipant(participantId, expenses = this.sheet.expenses) {
        return _.filter(expenses, expense => {
            return expense.payer === participantId ||expense.participants.indexOf(participantId) > -1;
        });
    }

    /**
     * Calculate all balances and shares
     * @param  {array} participants
     * @param  {array} expenses
     * @return {array}
     */
    getAllBalancesAndShares(participants = this.sheet.participants, expenses = this.sheet.expenses) {
        const findParticipant = (participantId =>_.find(participants, (p => p.id === participantId)));
        const balances = this.calculateBalances(expenses, participants);

        return _.chain(balances)
                .map(balance => {
                    return {
                        participantId: balance.participant,
                        participantName: findParticipant(balance.participant).name,
                        balance: balance.balance,
                        amount: this.calculateParticipantShare(
                            balance.participant, expenses
                        )
                    };
                })
                .value();
    }
}