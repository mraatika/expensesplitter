'use strict';

import _ from 'lodash';
import {t} from '../dictionary/dictionary';

export const validators = {

    required: function(value, rule) {
        return rule ? (value || value === 0) : void 0;
    },

    maxLength: function(value, rule) {
        return (value || '').length <= rule;
    },

    minLength: function(value, rule) {
        return !value || (value || '').length >= rule;
    },

    min: function(value, rule) {
        return (!value && value !== 0) || value >= rule;
    },

    max: function(value, rule) {
        return (!value && value !== 0) || value <= rule;
    },

    type: function(value, rule) {
        switch (rule) {
        case 'string':
            return _.isString(value);
        case 'decimal':
            let v = ('' + value).replace(',', ',');
            return /^[0-9]+(\.[0-9]{1,})?$/.test(v);
        case 'number':
            return _.isNumber(value) && !isNaN(value);
        case 'array':
            return _.isArray(value);
        case 'object':
            return _.isObject(value) &&
                !_.isArray(value) &&
                !_.isFunction(value);
        default:
            return true;
        }
    },

    pattern: function(value, rule) {
        let regex = _.isFunction(rule) ? rule.call(null) : rule;

        try {
            return new RegExp(regex).test(value);
        } catch(e) {
            console.error('Invalid pattern:', regex, e);
            return false;
        }
    }
};

var _formErrorReturnValue = function(msgKey, rule) {
    return msgKey ? t(msgKey + '.' + rule) : true;
};

var _getAttributeValidator = function(subject) {

    return function(ruleName, ruleValue) {

        for (var rule in ruleValue) {
            if (ruleValue.hasOwnProperty(rule)) {
                let validator = validators[rule];

                if (validator && !validator.call(null, subject[ruleName], ruleValue[rule])) {
                    return _formErrorReturnValue(ruleValue.msgKey, rule);
                }
            }
        }

        return void 0;
    };
};


export const validate = function(subject, schema) {
    var errors = {};
    var validator;

    if (!schema)  throw new Error('IllegalArgumentsException: Schema missing!');

    validator = _getAttributeValidator(subject);

    _.each(schema, function(value, key) {
        var error = validator(key, value);

        if (error) {
            errors[key] = error || void 0;
        }
    });

    return errors;
};

export const validateProperty = function(propertyName, propertyValue, schema) {
    var rules = schema[propertyName];

    for (var ruleName in rules) {
        let validator  = validators[ruleName] ;
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