import React, {PropTypes} from 'react';
import {omit} from 'lodash';
import {validateProperty} from 'common/validation/validator';

/**
 * @class ValidatedInput
 * @description An input field that is validated against a schema
 * @extends {React.Component}
 */
class ValidatedInput extends React.Component {

    /**
     * @constructor
     * @param {Object} props
     * @return {ValidatedInput}
     */
    constructor(props) {
        super(props);
        this.state = { isInvalid: false };
    }

    /**
     * Callback for the input field's change/blur/etc. event
     * @private
     * @return {undefined}
     */
    _onInputChange(e) {
        const value = this._getValue(e.target);
        const name = this.props.name;
        const error = this._validateProperty(name, value);

        this.setState({ isInvalid: !!error });

        if (error) {
            this.props.fail(name, value, error);
            return;
        }

        this.props.success(name, value);
    }

    /**
     * Get select's value
     * @private
     * @return {array|string|number}
     */
    _getValue(target) {
        switch(this.props.type) {
        case 'select':
            // if the select is a multiple selection form an array
            // from selected options
            if (this.props.multiple) {
                const options = target.options;
                const selected = [];

                for (let i in options) {
                    if (options[i].selected) {
                        selected.push(options[i].value);
                    }
                }

                return selected;
            }

            return target
                .options[target.selectedIndex]
                .value;
        default:
            return target.value;
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
        return validateProperty(name, value, this.props.schema);
    }

    /**
     * Form validation attributes for the input
     * @private
     * @return {object}
     */
    _formValidationProperties() {
        const type = this.props.type;
        const schema = this.props.schema[this.props.name];
        const commonProps = { required: !!schema.required };
        let typeProps;

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

        return {...commonProps, ...typeProps};
    }

    /**
     * Form event properties for the input (onChange, onBlur etc.)
     * @private
     * @return {object}
     */
    _formEventProperties() {
        const eventProps = {};
        const changeCallBack = this._onInputChange.bind(this);
        const formEventName = eventName => eventName[0].toUpperCase() + eventName.substring(1);

        for (const eventName in this.props.events) {
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
        return {
            ...this._formValidationProperties(),
            ...this._formEventProperties(),
            ...omit(this.props, [
                'schema',
                'success',
                'fail',
                'events',
                'children'
            ])
        };
    }

    render() {
        const {isInvalid} = this.state;
        const p = this._formInputProperties();
        const props = {
            ...p,
            className: p.className + (isInvalid ? ' error' : '')
        };

        switch (this.props.type) {
        case 'select':
            return <select {...props}>{this.props.children}</select>;
        case 'textarea':
            return <textarea {...props} />;
        default:
            return <input {...props} />;
        }
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
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    success: PropTypes.func,
    fail: PropTypes.func,
    events: PropTypes.object
};

export default ValidatedInput;