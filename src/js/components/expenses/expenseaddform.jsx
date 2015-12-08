import React from 'react';
import _ from 'lodash';
import {t} from '../../dictionary/dictionary';
import ActionCreator from '../..//actions/dataactioncreators';
import {Expense as ExpenseSchema} from '../../validation/schema/schema';
import MessageContainer from '../common/messagecontainer.jsx';
import ValidatedInput from '../common/validatedinput.jsx';
import ValidatedSelect from '../common/validatedselect.jsx';

/**
 * @class ExpensesAddForm
 * @description A form component to add expenses
 * @extends React.Component
 */
export default class ExpenseAddForm extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     *     {array} participants
     * @return {ExpenseAddForm}
     */
    constructor(props) {
        super(props);
        this._onExpensePropertyChange = this._onExpensePropertyChange.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
        this.state = this._getDefaultState();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Returns the default (initial) state
     * @private
     * @return {object} state
     */
    _getDefaultState() {
        var errors = {};

        if (!(this.props.participants || []).length) {
            errors.noParticipants = t('expenseaddform.error.participants');
        }

        return {
            expense: {
                name: '',
                price: null,
                participants: [],
                payer: (this.props.participants[0] || {}).id
            },
            errors: errors
        };
    }

    /**
     * Reset the form's state. Keeps the current payer and participant
     * as selected values
     * @private
     * @return {undefined}
     */
    _setIntitialExpense() {
        var initialExpense = this._getDefaultState().expense;
        initialExpense.payer = this.state.expense.payer;
        initialExpense.participants = this.state.expense.participants;
        this.setState({ expense:  initialExpense });
    }

    /**
     * Set a property to the expense model
     * @private
     * @param {string} prop
     * @param {string|number|array} value
     * @return {undefined}
     */
    _setExpenseValue(prop, value) {
        var expense = this.state.expense;
        expense[prop] = value;
        this.setState({ expense: expense });
    }

    /**
     * Set validation error to the state
     * @private
     * @param {string} property Property name
     * @param {string} error    Translated error text
     * @return {undefined}
     */
    _setValidationError(property, error) {
        // since execution of this method is delayed check
        // if this component is still mounted
        if (!this._isMounted) return;

        let errors = this.state.errors;
        errors[property] = error || null;
        this.setState({ 'errors': errors }, this._toggleErrorText.bind(this));

    }

    /**
     * Show/hide validation errors in the error text section
     * @private
     * @param  {string} property
     * @param  {*} value
     * @param  {string} error
     * @return {undefined}
     */
    _toggleErrorText() {
        let hasErrors = _.compact(_.values(this.state.errors)).length;

        if (hasErrors) {
            this.refs.errorMessageContainer.open();
        } else {
            this.refs.errorMessageContainer.close();
        }
    }

    /**
     * Clear validaton error of a property and set it to the
     * expense model
     * @private
     * @param  {string} name
     * @param  {*} value
     * @return {undefined}
     */
    _onExpensePropertyChange(name, value) {
        this._setValidationError(name);
        this._setExpenseValue(name, value);
    }

    /**
     * Callback for validation error (passed to the ValidatedInput components)
     * @param  {string} property Name of the errous property
     * @param  {*} value    Value of the property
     * @param  {string} error    Translated error text
     * @return {undefined}
     */
    _onValidationError(property, value, error) {
        this._setExpenseValue(property, value);
        // delay displaying the error so it doesn't prevent the first click
        // on elements below it on the screen
        _.delay(() => this._setValidationError(property, error), 100);
    }

    /**
     * Callback for participants select's change
     * @private
     * @param  {Event} e
     * @return {undefined}
     */
    _handleParticipantsChange(e) {
        var options = e.target.options;
        var selected = _.chain(options)
            .filter(option => !!option.selected)
            .pluck('value')
            .value();

        this._onExpensePropertyChange('participants', selected);
    }

    /**
     * Callback for payer select's change
     * @private
     * @param  {Event} e
     * @return {undefined}
     */
    _handlePayerChange(e) {
        var payerId = e.target.options[e.target.selectedIndex].value;
        this._onExpensePropertyChange('payer', payerId);
    }

    /**
     * Callback for form's submit event
     * @private
     * @param  {Event} e
     * @return {undefined}
     */
    _handleAddExpense(e) {
        var expense = this.state.expense;
        e.preventDefault();
        ActionCreator.addExpense(expense);
        this._setIntitialExpense();
    }

    render() {
        const expense = this.state.expense;
        const errorTexts = _.chain(this.state.errors)
            .values()
            .compact()
            .value();

        return (
            <form onSubmit={this._handleAddExpense.bind(this)}>
                <MessageContainer
                    ref="errorMessageContainer"
                    type="danger"
                    openOnMount={errorTexts.length}>
                    {errorTexts.map(function (error) {
                        return ([
                            <span className="message-text">{error}</span>,
                            <br/>
                        ]);
                    })}
                </MessageContainer>

                <div className="row">
                    <div className="three columns">
                        <label htmlFor="expense-name">{t('lang.expense')}:</label>
                        <ValidatedInput
                            ref={c => this._nameField = c}
                            type="text"
                            name="name"
                            id="expense-name"
                            className="u-full-width"
                            value={expense.name}
                            schema={ExpenseSchema}
                            success={this._onExpensePropertyChange}
                            fail={this._onValidationError}
                            events={{ change: true, blur: true }}/>
                    </div>

                    <div className="three columns">
                        <label htmlFor="expense-price">{t('lang.price') + ` (${this.props.currencySymbol})` }:</label>
                        <ValidatedInput
                            type="number"
                            name="price"
                            id="expense-price"
                            className="u-full-width"
                            value={expense.price}
                            step="any"
                            schema={ExpenseSchema}
                            success={this._onExpensePropertyChange}
                            fail={this._onValidationError}
                            events={{ change: true, blur: true }}/>
                    </div>

                    <div className="three columns">
                        <label htmlFor="expense-participants">{t('lang.participant_plural')}:</label>
                        <ValidatedSelect
                            name="participants"
                            id="expense-participants"
                            multiple={true}
                            className="u-full-width"
                            value={expense.participants}
                            schema={ExpenseSchema}
                            success={this._onExpensePropertyChange}
                            fail={this._onValidationError}
                            events={{change:true, blur: true}}>
                                {this.props.participants.map(participant =>
                                    <option
                                        key={participant.id}
                                        value={participant.id}>
                                        {participant.name}
                                    </option>
                                )}
                        </ValidatedSelect>
                    </div>

                    <div className="three columns">
                        <label htmlFor="expense-participants">{t('lang.payer')}:</label>
                        <ValidatedSelect
                            name="payer"
                            id="expense-payer"
                            className="u-full-width"
                            value={this.state.expense.payer}
                            schema={ExpenseSchema}
                            success={this._onExpensePropertyChange}
                            fail={this._onValidationError}
                            events={{change:true}}>
                                {this.props.participants.map(participant =>
                                    <option
                                        key={participant.id}
                                        value={participant.id}>
                                        {participant.name}
                                    </option>
                                )}
                        </ValidatedSelect>
                    </div>
                </div>
                <button
                    className="button-primary u-full-width"
                    disabled={errorTexts.length}
                    type="submit">
                    <i className="fa fa-plus fa-lg fa-fw" />
                    { t('expenses.add_expense') }
                </button>
            </form>
        );
    }
}
