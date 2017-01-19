import R from 'ramda';
import * as Schema from 'common/validation/schema';
import * as validator from 'common/validation/validator';
import {tpl} from 'common/dictionary/dictionary';
import {FunctionUtils, ArrayUtils} from 'client/util/utils';

/**
 * Format an error string from error object
 * @param  {Object} obj
 * @return {String}
 */
const formatArrayError = (obj) => `${obj.id}: ${ArrayUtils.toListString(obj.errors)}`;

/**
 * Validate an array of objects and form an error message
 * @private
 * @param  {Array} arr
 * @param  {Object} schema Schema to validate against
 * @return {Array} An array of error message strings
 */
const getArrayValidator = (schema) => {
    const validateObject = R.partialRight(validator.validate, [schema]);

    return R.when(
        Array.isArray,
        R.pipe(
            R.map(subject => ({ id: subject.id, errors: validateObject(subject) })),
            R.reject(R.where({ 'errors': R.isEmpty })),
            R.map(formatArrayError)
        )
    );
};

/**
 * Validate sheet
 * @type {Function}
 * @param {Object} sheet
 * @return {Object} An object of errors
 */
const validateSheet = R.partialRight(validator.validate, [Schema.Sheet]);

/**
 * Validate an array of participant objects
 * @private
 * @param  {Array} participants
 * @return {Array}
 */
const validateParticipants = getArrayValidator(Schema.Participant);

/**
 * Validate an array of expense objects
 * @private
 * @param  {Array} expenses
 * @return {Array}
 */
const validateExpenses = getArrayValidator(Schema.Expense);

/**
 * Set property to object if it's value is not empty
 * @param  {String} name Key
 * @param  {*} value
 * @return {Function}
 *         @param {Object} Object to set to
 *         @return {Object}
 */
const sePropIfNotEmpty = (name, value) => {
    return R.unless(
        () => R.isEmpty(value),
        R.set(R.lensProp(name), value)
    );
};

/**
 * Run validation function and return it's result as list string
 * @param  {Function} fn Validator
 * @param  {*} value
 * @return {String}
 */
const validationResultToListString = (fn, value) => {
    const result = fn(value);
    return ArrayUtils.toListString(result);
};

/**
 * Set validation error to error obj if not present and there were errors
 * @param  {String} prop Name of the validated prop
 * @param  {Function} fn Validator fn
 * @return {Function}
 *         @param {Object} error object
 *         @return {Object} error object
 */
const validateAndSetIfNotPresent = (source, prop, fn) => {
    return R.unless(
        R.has(prop),
        sePropIfNotEmpty(prop, validationResultToListString(fn, source[prop]))
    );
};

/**
 * Deep validate given sheet
 * @param  {Object} sheet
 * @return {Object} Property name as key and error message as value
 */
export const validate = (sheet) => {
    const validateAndSetSubPropIfNotPresent = R.partial(validateAndSetIfNotPresent, [sheet]);

    return R.pipe(
        validateSheet,
        validateAndSetSubPropIfNotPresent('participants', validateParticipants),
        validateAndSetSubPropIfNotPresent('expenses', validateExpenses)
    )(sheet);
};

/*
 * Check if object's removed property is true
 * @type {Function}
 * @param {Object}
 * @returns {Boolean}
 */
const isRemoved = R.propEq('removed', true);

/**
 * Check if expense's payer or any of the participants has marked as removed
 * @param {Array} List of ids of participants that are removed
 * @return {Function}
 *         @param  {Object} expense
 *         @return {Boolean}
 */
const getRemovedParticipantValidator = (removedParticipants) => {
    return R.pipe(
        R.pick(['participants', 'payer']),
        R.values,
        R.flatten,
        R.intersection(removedParticipants),
        R.prop('length'),
        Boolean
    );
};

/**
 * Find all expenses whose participant or payer is marked as removed
 * @param  {Object} sheet
 * @return {Array[Object]} Removed expenses
 */
export const findExpensesOfRemovedParticipants = ({ participants = [], expenses = [] }) => {
    // get ids of all the removed participants
    const removedParticipants = R.pluck('id', R.filter(isRemoved, participants));
    const hasExpenseRemovedParticipants = getRemovedParticipantValidator(removedParticipants);

    return R.pipe(
        R.reject(isRemoved),
        R.filter(hasExpenseRemovedParticipants)
    )(expenses);
};

/**
 * Format message for removed participant error
 * @param  {String} sheetName
 * @param  {Array[Object]} expenses
 * @return {String}
 */
const formatErrorMessage = (sheetName, expenses) => {
    return tpl('error.server.contains_removed_participant', {
        sheetName: sheetName,
        expenseNames: expenses.map(e => e.name).join(', ')
    });
};

const curriedFormatErrorMessage = R.curry(formatErrorMessage);

/**
 * Check if participant or a payer of an expense is removed
 * @param  {Object} sheet
 * @return {string|undefined} error message or undefined if the sheet is valid
 */
export const validateExpensesOfRemovedParticipants = (sheet) => {
    return R.pipe(
        R.pick(['participants', 'expenses']),
        findExpensesOfRemovedParticipants,
        R.ifElse(
            FunctionUtils.isNotEmpty,
            curriedFormatErrorMessage(sheet.name),
            R.always(undefined)
        )
    )(sheet);
};