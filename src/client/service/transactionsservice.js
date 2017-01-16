import {filter, pipe} from 'ramda';
import {calculateBalances} from 'client/service/expensesservice';
import {NumberUtils} from 'client/util/utils';

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
const zeroBalanceFilterer = balance => NumberUtils.round(balance.balance, 3);

/**
 *  Calculate the transactions. Creates a model for each
 *  transaction and adds them to the transactions collection
 *  @return {Array} Transactions
 */
export function calculateTransactions(sheet) {
    const {expenses, participants} = sheet;
    const transactions = [];
    let balances = pipe(
        calculateBalances,
        filter(zeroBalanceFilterer)
    )({ expenses, participants });

    // iterate until all accounts are even
    while (balances.length) {
        // the participant who needs to pay most
        const min = balances[0];
        // the participant who needs most compensation
        const max = balances[balances.length - 1];

        // break the loop if remaining balance has remainder
        // (calculations with float numbers are tricky)
        if (min.participant === max.participant) {
            break;
        }

        // how much the min can and need to pay to the max
        const amount = calculateTransActionAmount((min.balance * -1), max.balance);

        transactions.push({
            from: max.participant,
            to: min.participant,
            amount: amount
        });

        // update amounts
        min.balance += amount;
        max.balance -= amount;

        // filter out all zero balances
        balances = filter(zeroBalanceFilterer)(balances);
    }

    return transactions;
}