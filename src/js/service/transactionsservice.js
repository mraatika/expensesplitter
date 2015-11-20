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
const calculateTransActionAmount = (from, to) => from > to ? to : from;
/**
 * function for filtering out zero balances
 * @param  {object} balance
 * @return {boolean}
 */
const zeroBalanceFilterer = balance => !utils.Number.round(balance.balance, 3);

/**
 * @class TransactionService
 * @description Service for calculating transactions
 */
export default class TransactionsService {
    /**
     * @constructor
     * @param  {object} sheet
     * @return {TransactionsService}
     */
    constructor(sheet) {
        this.expensesService = new ExpensesService(sheet);
    }

    /**
     *  Calculate the transactions. Creates a model for each
     *  transaction and adds them to the transactions collection
     *  @return {array} Transactions
     */
    calculateTransactions() {
        const transactions = [];
        let balances = _.filter(this.expensesService.calculateBalances(), balance => balance.balance != 0);

        // iterate until all accounts are even
        while (balances.length) {
            // the participant who needs to pay most
            let min = balances[0];
            // the participant who needs most compensation
            let max = balances[balances.length - 1];

            // break the loop if remaining balance has remainder
            // (calculations with float numbers are tricky)
            if (min.participant === max.participant) {
                break;
            }

            // how much the min can and need to pay to the max
            let amount = calculateTransActionAmount((min.balance * -1), max.balance);

            transactions.push({
                from: max.participant,
                to: min.participant,
                amount: amount
            });

            // update amounts
            min.balance += amount;
            max.balance -= amount;

            // filter out all zero balances
            balances = _.reject(balances, zeroBalanceFilterer);
        }

        return transactions;
    }
}