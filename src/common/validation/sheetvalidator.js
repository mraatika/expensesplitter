import {map, compact, isEmpty, toArray} from 'lodash';
import * as Schema from 'common/validation/schema';
import * as validator from 'common/validation/validator';

/**
 * Validate an array of objects and form an error message
 * @private
 * @param  {Array} arr
 * @param  {Object} schema Schema to validate against
 * @return {Array} An array of error message strings
 */
const validateArray = (arr, schema) => {
    let errors = compact(map(arr, (subject) => {
        const errors = validator.validate(subject, schema);
        return !isEmpty(errors) ? `${subject.id}: ${toArray(errors).join(', ')}` : false;
    }));

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