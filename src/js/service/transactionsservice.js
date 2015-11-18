import ExpensesService from './expensesservice';
import * as utils from '../util/utils';
import _ from 'lodash';

/**
 *  Calculates the transaction amount
 *  @private
 *  @param {number} from How much can be paid.
 *  @param {number} to What needs to paid
 *  @return {number}
 */
var calculateTransActionAmount = function(from, to) {
    return from > to ? to : from;
};

/**
 * @class TransactionService
 * @description Service for calculating transactions
 */
export default class TransactionsService {
    constructor(sheet) {
        this.expensesService = new ExpensesService(sheet);
    }

    /**
     *  Calculate the transactions. Creates a model for each
     *  transaction and adds them to the transactions collection
     *  @return {array} Transactions
     */
    calculateTransactions() {
        var amount;
        var min;
        var max;
        var transactions = [];
        var balances = this.expensesService.calculateBalances();
        var filterZeroBalances = function (balance) {
            return !utils.Number.round(balance.balance, 3);
        };

        // iterate until all accounts are even
        while (balances.length) {
            // the participant who needs to pay most
            min = balances[0];
            // the participant who needs most compensation
            max = balances[balances.length - 1];

            // sometimes calculations with floats are tricky
            // so if the balances are never
            if (min.participant === max.participant) {
                break;
            }

            // how much the min can and need pay to the max
            amount = calculateTransActionAmount((min.balance * -1), max.balance);

            transactions.push({
                from: max.participant,
                to: min.participant,
                amount: amount
            });

            // update amounts
            min.balance += min.balance;
            max.balance -= max.balance;

            // filter out all zero balances
            balances = _.reject(balances, filterZeroBalances);
        }

        return transactions;
    }
}