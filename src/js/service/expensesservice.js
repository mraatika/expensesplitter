'use strict';

import _ from 'lodash';

/**
 * Service for calculations related to expenses
 * @constructor
 * @param {Object} sheet
 */
var ExpensesService = function(sheet) {
    this.sheet = sheet;
};

/**
 * Calculate balance for each participant.
 * @param {Array} expenses
 * @param {Array} participants
 * @returns {Array} An array of objects
 *     {String} participant
 *     {Number} balance
 *
 */
ExpensesService.prototype.calculateBalances = function(expenses = this.sheet.expenses, participants = this.sheet.participants) {
    var self = this;

    return _.chain(participants)
        .map(function (participant) {
            return {
                participant: participant.id,
                balance: self.calculateParticipantBalance(participant.id, expenses)
            };
        })
        .filter(function (balance) {
            return balance.balance !== 0;
        })
        .sortBy(function (balance) {
            return balance.balance;
        })
        .value();
};

/**
 * Returns the current balance of a participant (share - paid)
 * @param {Array} expenses
 * @param {String} participantId
 * @returns {Number}
 */
ExpensesService.prototype.calculateParticipantBalance = function(participantId, expenses = this.sheet.expenses) {
    var total = this.calculateParticipantShare(participantId, expenses),
        paid = this.calculateParticipantTotalPaid(participantId, expenses);

    return total - paid;
};

/**
 * Calculates participant's share of expenses
 *  @param {Array} expenses
 * @param {String} participantId Participant's id
 * @returns {Number} The sum of expenses
 */
ExpensesService.prototype.calculateParticipantShare = function(participantId, expenses = this.sheet.expenses) {
    return _.reduce(expenses, function (sum, expense) {
        // expense's participants
        var participants = expense.participants || [],
            price = +expense.price || 0;

        // if price is invalid, zero or the participant given
        // in parameters hasn't participated in this expense
        if (!price || participants.indexOf(participantId) === -1) {
            return sum;
        }

        return sum + (price / participants.length);

    }, 0);
};

/**
 * Returns the total sum paid
 * @param {String} participantId
 * @param {Array} expenses
 * @returns {Number}
 */
ExpensesService.prototype.calculateParticipantTotalPaid = function(participantId, expenses = this.sheet.expenses) {
    return _.reduce(expenses, function (sum, expense) {
        // expense's participants
        var payer = expense.payer,
            price = +expense.price;

        // if price is invalid, zero or the participant given
        // in parameters hasn't participated in this expense
        if (!price || payer !== participantId) {
            return sum;
        }

        return sum + price;

    }, 0);
};

/**
 * Return the total sum of all the expenses
 * @param {Array} expenses
 * @returns {Number} The total sum
 */
ExpensesService.prototype.getTotalSum = function(expenses = this.sheet.expenses) {
    return _.reduce(expenses, function (sum, expense) {
        return sum + (+expense.price || 0);
    }, 0);
};

/**
 * Get expeneses of a participant
 *
 * @param {String} participantId Participant's id
 * @return {Array} An array of expenses
 */
ExpensesService.prototype.findExpensesByParticipant = function(participantId, expenses = this.sheet.expenses) {
    return _.filter(expenses, function (expense) {
        return expense.participants.indexOf(participantId) > -1;
    });
};

/**
 * Find expenses paid by a participant
 * @param  {String} participantId
 * @param  {Array} expenses
 * @return {Array} An array of expenses
 */
ExpensesService.prototype.findExpensesPaidByParticipant = function(participantId, expenses = this.sheet.expenses) {
    return _.filter(expenses, (expense) => {
        return expense.payer === participantId;
    });
};

/**
 * Calculate all balances and shares
 * @param  {Array} participants
 * @param  {Array} expenses
 * @return {Array}
 */
ExpensesService.prototype.getAllBalancesAndShares = function(participants = this.sheet.participants, expenses = this.sheet.expenses) {
    var self = this;
    var findParticipant = (participantId =>_.find(participants, (p => p.id === participantId)));
    var balances = this.calculateBalances(expenses, participants);

    return _.chain(balances)
            .map(function(balance) {
                return {
                    participantId: balance.participant,
                    participantName: findParticipant(balance.participant).name,
                    balance: balance.balance,
                    amount: self.calculateParticipantShare(
                        balance.participant, expenses
                    )
                };
            })
            .value();
};

export default ExpensesService;