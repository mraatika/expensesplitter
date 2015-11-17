import React from 'react';
import {validateProperty} from '../../validation/validation';
import classNames from 'classnames';

/**
 * @class ValidatedInput
 * @description An input field that is validated against a schema
 * @extends {React.Component}
 */
export class ValidatedInput extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     *     {object} schema      A schema object
     *     {string} name        Name of the property this field is bound to in the model
     *     {success} function   A success callback (fired when property validation passes)
     *     {fail} function      A fail callback (fired when property validation fails)
     * @return {ValidatedInput}
     */
    constructor(props) {
        super(props);
        this.schema = this.props.schema;
        if (!this.schema) throw new Error('InvalidArgumentsException: Property schema missing!');
    }

    /**
     * Callback for the input field's change/blur/etc. event
     * @private
     * @return {undefined}
     */
    _onInputChange() {
        let value = this.refs.inputField.value;
        let name = this.props.name;
        let error = this._validateProperty(name, value);

        if (!error) {
            this.props.success(name, value);
        } else {
            this.props.fail(name, value, error);
        }
    }

    /**
     * Validate value and toggle input node's error class accordingly
     * @private
     * @param  {string} name
     * @param  {*} value
     * @return {string} error text
     */
    _validateProperty(name, value) {
        var error = validateProperty(name, value, this.props.schema);
        this._toggleErrorClass(error);
        return error;
    }

    /**
     * Toggle input's error class
     * @param  {boolean} hasErrors
     * @return {undefined}
     */
    _toggleErrorClass(hasErrors) {
        var inputClass = classNames(this.props.className, {
            error: !!hasErrors
        });

        this.refs.inputField.className = inputClass;
    }

    /**
     * Form validation attributes for the input
     * @private
     * @return {object}
     */
    _formValidationProperties() {
        let schema = this.schema[this.props.name];
        let type = this.props.type;
        let typeProps = {};
        let commonProps = { required: !!schema.required };

        switch (type) {
        case 'range':
        case 'number':
            typeProps = {
                min: schema.min || null,
                max: schema.max || null
            };
            break;
        default:
            typeProps = {
                minLength: schema.minLength || -1,
                maxLength: schema.maxLength || -1
            };
            break;
        }

        return Object.assign(commonProps, typeProps);
    }

    /**
     * Form event properties for the input (onChange, onBlur etc.)
     * @private
     * @return {object}
     */
    _formEventProperties() {
        let eventProps = {};
        let changeCallBack = this._onInputChange.bind(this);
        let formEventName = eventName => eventName[0].toUpperCase() + eventName.substring(1);

        for (let eventName in this.props.events) {
            eventProps['on' + formEventName(eventName)] = changeCallBack;
        }

        return eventProps;
    }

    /**
     * Form all properties for the input field. Combining event, validation and
     * properties passed in constructor.
     * @private
     * @return {object}
     */
    _formInputProperties() {
        return Object.assign(
            this._formValidationProperties(),
            this._formEventProperties(),
            this.props
        );
    }

    render() {
        let props = this._formInputProperties();

        return (
            <input ref="inputField" {...props} />
        );
    }
}

/**
 * Default properties
 * @type {object}
 */
ValidatedInput.defaultProps = {
    success: () => {},
    fail: () => {}
};

/**
 * Proptype validation
 * @type {object}
 */
ValidatedInput.propTypes = {
    schema: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    success: React.PropTypes.func,
    fail: React.PropTypes.func,
    events: React.PropTypes.object
};