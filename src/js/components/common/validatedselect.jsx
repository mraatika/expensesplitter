import React from 'react'; // eslint-disable-line no-unused-vars
import {chain} from 'lodash';
import ValidatedInput from './validatedinput.jsx';

/**
 * @class ValidatedSelect
 * @description A select element that's validated against a schema
 * @extends ValidatedInput
 */
export default class ValidatedSelect extends ValidatedInput {
    /**
     * Callback for the select's change/blur/etc. event
     * @private
     * @return {undefined}
     */
    _onInputChange() {
        let value = this._getValue();
        let name = this.props.name;
        let error = this._validateProperty(name, value);

        if (!error) {
            this.props.success(name, value);
        } else {
            this.props.fail(name, value, error);
        }
    }

    /**
     * Get select's value
     * @private
     * @return {array|string|number}
     */
    _getValue() {
        // if the select is a multiple selection form an array
        // from selected options
        if (this.props.multiple) {
            let options = this.refs.inputField.options;
            return chain(options)
                .filter(option => !!option.selected)
                .pluck('value')
                .value();
        } else {
            return this.refs.inputField.options[this.refs.inputField.selectedIndex].value;
        }
    }

    render() {
        const props = this._formInputProperties();

        return (
            <select ref="inputField" {...props}>
                {this.props.children}
            </select>
        );
    }
}