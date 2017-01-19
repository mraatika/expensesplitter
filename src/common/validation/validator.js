import R from 'ramda';
import {t} from 'common/dictionary/dictionary';
import {FunctionUtils} from 'client/util/utils';

/**
 * Validation functions for validation rules
 * @type {Object}
 */
export const validators = {

    required: (value, rule) => rule && (value || value === 0),

    minLength: (value, rule) => (value || '').length >= rule,

    maxLength: (value, rule) => (value || '').length <= rule,

    min: (value, rule) => value >= rule,

    max: (value, rule) => value <= rule,

    type: (value, rule) => {
        const type = typeof value;

        switch (rule) {
        case 'string':
            return type === 'string';
        case 'decimal':
            {
                const v = ('' + value).replace(',', '.');
                return /^[0-9]+(\.[0-9]{1,})?$/.test(v);
            }
        case 'number':
            return type === 'number' && !isNaN(value);
        case 'array':
            return Array.isArray(value);
        case 'object':
            return type == 'object' &&
                !Array.isArray(value);
        default:
            return true;
        }
    },

    pattern: (value, rule) => {
        const regex = typeof rule === 'function' ? rule.call(null) : rule;

        try {
            return new RegExp(regex).test(value);
        } catch(e) {
            console.error('Invalid pattern:', regex, e);
            return false;
        }
    }
};

/**
 * Form error message
 * @private
 * @param   {string} msgKey
 * @param   {string} rule
 * @return  {string}
 */
const formErrorReturnValue = (msgKey, rule) => msgKey ? t(msgKey + '.' + rule) : true;

/**
 * Check if a property has validator function
 * @param  {String} name
 * @return {Boolean}
 */
const hasValidator = name => validators[name];

/**
 * Partial function for validator functions. Returns validation function for a property
 * @private
 * @param   {Object} subject
 * @return  {Function}
 */
const getAttributeValidator = function(subject) {

    /**
     * Get validation function for a property
     * @param  {String} propName Name of the validated property
     * @param  {Object} rules A set of validation rules
     * @return {String}
     */
    return function actualValidator(rules, propName) {
        const propValue = subject[propName];
        const errorMessageFormatter = R.partial(formErrorReturnValue, [rules.msgKey]);

        // do not run validation is value is nil and the prop is not required
        if (!rules.required && R.isNil(propValue)) return null;

        return R.pipe(
            // select all rules that have a validator fn
            R.pickBy(FunctionUtils.callWithSecondArg(hasValidator)),
            R.mapObjIndexed((ruleValues, ruleName) => {
                const validator = validators[ruleName];
                return validator(propValue, ruleValues) ? null : errorMessageFormatter(ruleName);
            }),
            R.pickBy(FunctionUtils.isNotNil),
            // if not empty return first value of the object
            R.ifElse(R.isEmpty, R.always(null), R.pipe(R.values, R.head))
        )(rules);
    };
};

/**
 * Validate an object against a schema
 * @param  {Object} subject
 * @param  {Object} schema
 * @return {Object}
 */
export const validate = function(subject, schema) {
    const validator = getAttributeValidator(subject);

    return R.pipe(
        R.mapObjIndexed(validator),
        R.pickBy(FunctionUtils.isNotNil)
    )(schema);
};

/**
 * Validate a property against given schema
 * @param  {String} key
 * @param  {*} value
 * @param  {Object} schema
 * @return {String}
 */
export const validateProperty = function(key, value, schema) {
    const subject = { [key]: value };

    return R.pipe(
        validate,
        R.ifElse(
            R.isEmpty,
            R.always(undefined),
            R.prop(key)
        )
    )(subject, schema);
};