import {filter, indexBy, isEmpty, map, pipe, prop, values} from 'ramda';
import * as Schema from 'common/validation/schema';
import * as validator from 'common/validation/validator';
import {tpl} from 'common/dictionary/dictionary';

/**
 * Validate an array of objects and form an error message
 * @private
 * @param  {Array} arr
 * @param  {Object} schema Schema to validate against
 * @return {Array} An array of error message strings
 */
const validateArray = (arr, schema) => {
    if (!(arr instanceof Array)) return [];

    let errors = pipe(
        map(subject => {
            const errors = validator.validate(subject, schema);
            return !isEmpty(errors) ? `${subject.id}: ${values(errors).join(', ')}` : false;
        }),
        filter(e => !!e)
    )(arr);

    return errors.length ? errors : [];
};

/**
 * Validate an array of participant objects
 * @private
 * @param  {Array} participants
 * @return {Array}
 */
const validateParticipants = participants => validateArray(participants, Schema.Participant);

/**
 * Validate an array of expense objects
 * @private
 * @param  {Array} expenses
 * @return {Array}
 */
const validateExpenses = expenses => validateArray(expenses, Schema.Expense);

/**
 * Deep validate given sheet
 * @param  {Object} sheet
 * @return {Object} Property name as key and error message as value
 */
export const validate = (sheet) => {
    // sheet related errors
    let errors = {...validator.validate(sheet, Schema.Sheet) };

    // errors in participant objects
    const participantErrors = validateParticipants(sheet.participants);

    if (participantErrors.length) {
        errors.participants = participantErrors.join(', ');
    }

    // errors in expense objects
    const expenseErrors = validateExpenses(sheet.expenses);

    if (expenseErrors.length) {
        errors.expenses = expenseErrors.join(', ');
    }

    return errors;
};

/**
 * Find all expenses whose participant or payer is marked as removed
 * @param  {Array} participants
 * @param  {Array} expenses
 * @return {Array} Removed expenses
 */
export const findExpensesOfRemovedParticipants = (participants = [], expenses = []) => {
    const pMap = indexBy(prop('id'), participants);
    const removed = [];

    if (!participants.length) return removed;

    for (const i in expenses) {
        const expense = expenses[i];

        if (expense.removed) continue;

        if (pMap[expenses[i].payer].removed) {
            removed.push(expense);
            continue;
        }

        for (const j in expense.participants) {
            const id = expense.participants[j];

            if (pMap[id].removed) {
                removed.push(expense);
            }
        }
    }

    return removed;
};

/**
 * Check if participant or a payer of an expense is removed
 * @param  {Object} sheet
 * @return {string|undefined} error message or undefined if the sheet is valid
 */
export const validateExpensesOfRemovedParticipants = (sheet) => {
    const {participants, expenses} = sheet;
    const expensesOfRemovedParticipants = findExpensesOfRemovedParticipants(participants, expenses);

    if (!expensesOfRemovedParticipants.length) return;

    return tpl('error.server.contains_removed_participant', {
        sheetName: sheet.name,
        expenseNames: expensesOfRemovedParticipants.map(e => e.name).join(', ')
    });
};