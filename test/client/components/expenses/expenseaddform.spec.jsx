import {expect} from 'chai';
import _ from 'lodash';
import sinon from 'sinon';
import {t} from 'dictionary/dictionary';

describe('Component:ExpenseAddForm', function() {
    const jsdom = require('mocha-jsdom');

    let React;
    let ReactDOM;
    let TestUtils;
    let ExpenseAddForm;

    var expenseAddForm;
    var page = {};
    var participants = [
        {id: 1, name: 'Seppo'},
        {id: 2, name: 'Kake'},
        {id: 3, name: 'Jorma'}
    ];

    var renderComponent = function(props) {
        props = Object.assign({
            participants,
            expenses: [],
            onSubmit: sinon.spy()
        }, props);

        expenseAddForm = TestUtils.renderIntoDocument(
            <ExpenseAddForm {...props} />
        );

        page.nameField = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-name');
        page.priceField = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-price');
        page.participantsSelect = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-participants');
        page.payerSelect = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-payer');
        page.errorText = TestUtils.findRenderedDOMComponentWithClass(expenseAddForm, 'danger');
        page.submitButton = TestUtils.findRenderedDOMComponentWithTag(expenseAddForm, 'button');
        page.expenseForm = TestUtils.findRenderedDOMComponentWithTag(expenseAddForm, 'form');
    };

    jsdom();

    before(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        TestUtils = require('react-testutils-additions');
        ExpenseAddForm = require('components/expenses/expenseaddform.jsx').default;
    });

    beforeEach(function () {
        renderComponent();
    });

    describe('Rendering', function () {
        it('should have default values set', function () {
            expect(page.nameField.value).to.equal('');
            expect(page.priceField.value).to.equal('');
            expect(page.participantsSelect.value).to.equal('' + participants[0].id);
            expect(page.payerSelect.value).to.equal('' + participants[0].id);
        });

        it('should display an error when current sheet doesn\'t contain any participants', function () {
            renderComponent({ participants: [] });
            expect(page.errorText.textContent).to.equal(t('expenseaddform.error.participants'));
            expect(page.submitButton.disabled).to.be.ok;
        });
    });

    describe('Validating', function () {

        describe('name', function () {
            it('should require a name', function (done) {
                page.nameField.value = '';

                TestUtils.Simulate.change(page.nameField);

                setTimeout(() => {
                    expect(page.errorText.textContent).to.equal(t('error.expense.name.required'));
                    expect(page.nameField.className.indexOf('error')).not.to.equal(-1);
                    done();
                }, 105);
            });

            it('should require name to contain less than 100 characters', function (done) {
                var str = _.range(0, 100).join('');
                page.nameField.value = str;
                TestUtils.Simulate.change(page.nameField);

                setTimeout(() => {
                    expect(page.errorText.textContent).to.equal(t('error.expense.name.maxLength'));
                    done();
                }, 105);
            });
        });

        describe('price', function () {
            it('should require a price', function (done) {
                page.priceField.value = '';
                TestUtils.Simulate.change(page.priceField);

                setTimeout(() => {
                    expect(page.errorText.textContent).to.equal(t('error.expense.price.required'));
                    expect(page.priceField.className.indexOf('error')).not.to.equal(-1);
                    done();
                }, 105);
            });

            it('should require price to be greater than 0', function (done) {
                page.priceField.value = 0;
                TestUtils.Simulate.change(page.priceField, { target: { value: 0 }});

                setTimeout(() => {
                    expect(page.errorText.textContent).to.equal(t('error.expense.price.min'));
                    expect(page.priceField.className.indexOf('error')).not.to.equal(-1);
                    done();
                }, 105);
            });

            it('should require price less than 1000000', function (done) {
                page.priceField.value = 1000001;
                TestUtils.Simulate.change(page.priceField);

                setTimeout(() => {
                    expect(page.errorText.textContent).to.equal(t('error.expense.price.max'));
                    expect(page.priceField.className.indexOf('error')).not.to.equal(-1);
                    done();
                }, 105);
            });
        });
    });

    describe('Selecting a default payer', function () {
        var expenseModel = {
            name: 'Beer',
            price: 150,
            participants: [ 2 ],
            payer: 2
        };

        var participantOptions = participants.map(function(p) {
            return { value: p.id, selected: p.id === expenseModel.payer };
        });

        it('should keep current payer as default', function () {
            expenseAddForm.setState({ expense: expenseModel });

            TestUtils.Simulate.submit(page.expenseForm);
            expect(expenseAddForm.props.onSubmit.calledWith(expenseModel)).to.be.ok;

            expect(page.payerSelect.value).to.equal('' + participants[1].id);
            expect(expenseAddForm.state.expense.payer).to.equal(participants[1].id);

            // this time without changing the payer select
            TestUtils.Simulate.change(page.nameField, { target: { value: expenseModel.name }});
            TestUtils.Simulate.change(page.priceField, { target: { value: expenseModel.price }});
            TestUtils.Simulate.change(page.participantsSelect, { target: { options: participantOptions }});
            TestUtils.Simulate.submit(page.expenseForm);

            expect(expenseAddForm.props.onSubmit.calledWith(expenseModel)).to.be.ok;
            expect(page.payerSelect.value).to.equal('' + participants[1].id);
            expect(expenseAddForm.state.expense.payer).to.equal(participants[1].id);
        });
    });

    describe('Selecting default participants', function () {
        var expenseModel = {
            name: 'Beer',
            price: 150,
            participants: [ 1, 2 ],
            payer: 2
        };

        var participantOptions = participants.map(function(p) {
            return { value: p.id, selected: false };
        });

        it('should keep current participants as default', function () {
            expenseAddForm.setState({ expense: expenseModel });

            TestUtils.Simulate.submit(page.expenseForm);
            expect(expenseAddForm.props.onSubmit.calledWith(expenseModel)).to.be.ok;

            //expect(page.participants.value).to.equal('' + participants[1].id);
            expect(expenseAddForm.state.expense.participants).to.deep.equal([ 1, 2 ]);

            // this time without changing the payer select
            TestUtils.Simulate.change(page.nameField, { target: { value: expenseModel.name }});
            TestUtils.Simulate.change(page.priceField, { target: { value: expenseModel.price }});
            TestUtils.Simulate.change(page.payerSelect, { target: { 'options': participantOptions, selectedIndex: 1 }});
            TestUtils.Simulate.submit(page.expenseForm);

            expect(expenseAddForm.props.onSubmit.calledWith(expenseModel)).to.be.ok;
        });
    });

    describe('form submit', function () {
        var expenseModel = {
            name: 'Beer',
            price: '1000',
            participants: ['1', '2', '3'],
            payer: '1'
        };

        it('should call ActionCreators.addExpense with expense model when submitting a valid form', function () {
            page.nameField.value = expenseModel.name;
            TestUtils.Simulate.change(page.nameField);
            page.priceField.value = expenseModel.price;
            TestUtils.Simulate.change(page.priceField);
            page.payerSelect.selectedIndex = 0;
            TestUtils.Simulate.change(page.payerSelect);
            page.participantsSelect.options[0].selected = true;
            page.participantsSelect.options[1].selected = true;
            page.participantsSelect.options[2].selected = true;
            TestUtils.Simulate.change(page.participantsSelect);

            expect(page.errorText.style.display).to.equal('none');
            expect(page.submitButton.disabled).not.to.be.ok;
            TestUtils.Simulate.submit(page.expenseForm);

            expect(expenseAddForm.props.onSubmit.calledWith(expenseModel)).to.be.ok;
        });
    });
});