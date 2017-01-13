import {t} from 'common/dictionary/dictionary';

export const validators = {

    required: (value, rule) => {
        return rule ? (value || value === 0) : void 0;
    },

    maxLength: (value, rule) => {
        return (value || '').length <= rule;
    },

    minLength: (value, rule) => {
        return !value || (value || '').length >= rule;
    },

    min: (value, rule) => {
        return (!value && value !== 0) || value >= rule;
    },

    max: (value, rule) => {
        return (!value && value !== 0) || value <= rule;
    },

    type: (value, rule) => {
        switch (rule) {
        case 'string':
            return typeof value === 'string';
        case 'decimal':
            {
                const v = ('' + value).replace(',', ',');
                return /^[0-9]+(\.[0-9]{1,})?$/.test(v);
            }
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'array':
            return Array.isArray(value);
        case 'object':
            const type = typeof value;
            return type == 'object' &&
                !Array.isArray(value);
        default:
            return true;
        }
    },

    pattern: (value, rule) => {
        const regex = rule && typeof rule === 'function' ? rule.call(null) : rule;

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
const _formErrorReturnValue = function(msgKey, rule) {
    return msgKey ? t(msgKey + '.' + rule) : true;
};

/**
 * Partial application function for validator functions. Get validation
 * function for a rule
 * @private
 * @param   {Object} subject
 * @return  {Function}
 */
const _getAttributeValidator = function(subject) {

    /**
     * Get validation function for a rule
     * @param  {string} ruleName
     * @param  {*} ruleValue
     * @return {string}
     */
    return (ruleName, ruleValue) => {
        for (let rule in ruleValue) {
            if (ruleValue.hasOwnProperty(rule)) {
                const validator = validators[rule];

                if (validator && !validator.call(null, subject[ruleName], ruleValue[rule])) {
                    return _formErrorReturnValue(ruleValue.msgKey, rule);
                }
            }
        }

        return void 0;
    };
};

/**
 * Validate an object against a schema
 * @param  {Object} subject
 * @param  {Object} schema
 * @return {Object}
 */
export const validate = function(subject, schema) {
    const errors = {};

    if (!schema)  throw new Error('IllegalArgumentsException: Schema missing!');

    const validator = _getAttributeValidator(subject);

    for (const key in schema) {
        const rules = schema[key];
        const value = subject[key];

        // do not run validator if property is not required and is missing
        if (!rules.required && (value === null || value === undefined)) {
            continue;
        }

        const error = validator(key, rules);

        if (error) {
            errors[key] = error;
        }
    }

    return errors;
};

/**
 * Validate a property against given schema
 * @param  {string} propertyName
 * @param  {*} propertyValue
 * @param  {Object} schema
 * @return {string}
 */
export const validateProperty = function(propertyName, propertyValue, schema) {
    const rules = schema[propertyName];

    for (let ruleName in rules) {
        const validator  = validators[ruleName] ;

        if (!rules.required && !propertyValue) return;

        if (validator && !validator.call(null, propertyValue, rules[ruleName])) {
            return _formErrorReturnValue(rules.msgKey, ruleName);
        }
    }

    return void 0;
};

export default {
    validators: validators,
    validate: validate,
    validateProperty: validateProperty
};