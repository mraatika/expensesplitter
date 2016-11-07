import React, {PropTypes} from 'react';
import {delay, chain} from 'lodash';
import {t} from 'common/dictionary/dictionary';
import {Expense as ExpenseSchema} from 'common/validation/schema';
import MessageContainer from 'client/components/common/messagecontainer.jsx';
import ValidatedInput from 'client/components/common/validatedinput.jsx';

/**
 * @class ExpensesAddForm
 * @description A form component to add expenses
 * @extends React.Component
 */
class ExpenseAddForm extends React.Component {

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
        this.state = this._formState();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._formState(nextProps));
    }

    /**
     * Returns the default (initial) state
     * @private
     * @param {Object} properties If omitted this.props will be used
     * @return {Object} state
     */
    _formState(properties) {
        const errors = {};
        const props = properties || this.props;
        let participants = [];
        let payer;

        if (!props.participants.length) {
            errors.noParticipants = t('expenseaddform.error.participants');
        } else {
            payer = props.participants[0].id;
        }

        // if previous state is available then keep payer and participant values
        if (this.state) {
            payer = this.state.expense.payer;
            participants = this.state.expense.participants;
        }

        return {
            expense: {
                name: '',
                price: '',
                participants,
                payer
            },
            errors: errors
        };
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

        const errors = { ...this.state.errors, [property]: error || null };
        this.setState({ 'errors': errors });
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
        delay(() => this._setValidationError(property, error), 100);
    }

    /**
     * Callback for participants select's change
     * @private
     * @param  {Event} e
     * @return {undefined}
     */
    _handleParticipantsChange(e) {
        var options = e.target.options;
        var selected = chain(options)
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
        this.props.onSubmit(expense);
    }

    render() {
        const expense = this.state.expense;
        const errorTexts = chain(this.state.errors)
            .values()
            .compact()
            .value();

        return (
            <form onSubmit={this._handleAddExpense.bind(this)}>
                <MessageContainer
                    type="danger"
                    show={!!errorTexts.length}
                    closable={false}>
                    {errorTexts.map(error => {
                        return ([
                            <span>
                                <span className="message-text">{error}</span>,
                                <br/>
                            </span>
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
                        <ValidatedInput
                            name="participants"
                            id="expense-participants"
                            type="select"
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
                        </ValidatedInput>
                    </div>

                    <div className="three columns">
                        <label htmlFor="expense-participants">{t('lang.payer')}:</label>
                        <ValidatedInput
                            name="payer"
                            id="expense-payer"
                            type="select"
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
                        </ValidatedInput>
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

ExpenseAddForm.defaultProps = {
    participants: [],
    currencySymbol: ''
};

ExpenseAddForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    participants: PropTypes.array,
    currencySymbol: PropTypes.string
};

export default ExpenseAddForm;