jest.autoMockOff();

import React from 'react';
import TestUtils from 'react-testutils-additions';
import _ from 'lodash';

const ExpenseAddForm = require('../../../components/expenses/expenseaddform.jsx').default;
const dictionary = require('../../../dictionary/dictionary');

var expenseAddForm;
var page = {};

var renderComponent = function(participants) {
    expenseAddForm = TestUtils.renderIntoDocument(
        <ExpenseAddForm participants={participants} expenses={[]} onSubmit={jasmine.createSpy()} />
    );

    page.nameField = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-name');
    page.priceField = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-price');
    page.participantsSelect = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-participants');
    page.payerSelect = TestUtils.findRenderedDOMComponentWithId(expenseAddForm, 'expense-payer');
    page.errorText = TestUtils.findRenderedDOMComponentWithClass(expenseAddForm, 'danger');
    page.submitButton = TestUtils.findRenderedDOMComponentWithTag(expenseAddForm, 'button');
    page.expenseForm = TestUtils.findRenderedDOMComponentWithTag(expenseAddForm, 'form');
};

describe('Component:ExpenseAddForm', function() {
    var participants = [
        {id: 1, name: 'Seppo'},
        {id: 2, name: 'Kake'},
        {id: 3, name: 'Jorma'}
    ];

    beforeEach(function () {
        renderComponent(participants);
    });

    describe('Rendering', function () {
        it('should have default values set', function () {
            expect(page.nameField.getAttribute('value')).toBeFalsy();
            expect(page.priceField.getAttribute('value')).toBeFalsy();
            expect(page.participantsSelect.getAttribute('value')).toBeFalsy();
            expect(page.payerSelect.getAttribute('value')).toBeFalsy();
        });

        it('should display an error when current sheet doesn\'t contain any participants', function () {
            renderComponent([]);
            expect(page.errorText.textContent).toEqual(dictionary.t('expenseaddform.error.participants'));
            expect(page.submitButton.disabled).toBeTruthy();
        });
    });

    describe('Validating', function () {

        describe('name', function () {
            it('should require a name', function (done) {
                page.nameField.value = '';

                TestUtils.Simulate.change(page.nameField);

                setTimeout(() => {
                    expect(page.errorText.textContent).toEqual(dictionary.t('error.expense.name.required'));
                    expect(page.nameField.className.indexOf('error')).not.toEqual(-1);
                    done();
                }, 105);
            });

            it('should require name to contain less than 100 characters', function (done) {
                var str = _.range(0, 100).join('');
                page.nameField.value = str;
                TestUtils.Simulate.change(page.nameField);

                setTimeout(() => {
                    expect(page.errorText.textContent).toEqual(dictionary.t('error.expense.name.maxLength'));
                    done();
                }, 105);
            });
        });

        describe('price', function () {
            it('should require a price', function (done) {
                page.priceField.value = '';
                TestUtils.Simulate.change(page.priceField);

                setTimeout(() => {
                    expect(page.errorText.textContent).toEqual(dictionary.t('error.expense.price.required'));
                    expect(page.priceField.className.indexOf('error')).not.toEqual(-1);
                    done();
                }, 105);
            });

            it('should require price to be greater than 0', function (done) {
                page.priceField.value = 0;
                TestUtils.Simulate.change(page.priceField, { target: { value: 0 }});

                setTimeout(() => {
                    expect(page.errorText.textContent).toEqual(dictionary.t('error.expense.price.min'));
                    expect(page.priceField.className.indexOf('error')).not.toEqual(-1);
                    done();
                }, 105);
            });

            it('should require price less than 1000000', function (done) {
                page.priceField.value = 1000001;
                TestUtils.Simulate.change(page.priceField);

                setTimeout(() => {
                    expect(page.errorText.textContent).toEqual(dictionary.t('error.expense.price.max'));
                    expect(page.priceField.className.indexOf('error')).not.toEqual(-1);
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
            expect(expenseAddForm.props.onSubmit).toHaveBeenCalledWith(expenseModel);

            expect(page.payerSelect.value).toEqual('' + participants[1].id);
            expect(expenseAddForm.state.expense.payer).toEqual(participants[1].id);

            // this time without changing the payer select
            TestUtils.Simulate.change(page.nameField, { target: { value: expenseModel.name }});
            TestUtils.Simulate.change(page.priceField, { target: { value: expenseModel.price }});
            TestUtils.Simulate.change(page.participantsSelect, { target: { options: participantOptions }});
            TestUtils.Simulate.submit(page.expenseForm);

            expect(expenseAddForm.props.onSubmit).toHaveBeenCalledWith(expenseModel);
            expect(page.payerSelect.value).toEqual('' + participants[1].id);
            expect(expenseAddForm.state.expense.payer).toEqual(participants[1].id);
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
            expect(expenseAddForm.props.onSubmit).toHaveBeenCalledWith(expenseModel);

            //expect(page.participants.value).toEqual('' + participants[1].id);
            expect(expenseAddForm.state.expense.participants).toEqual([ 1, 2 ]);

            // this time without changing the payer select
            TestUtils.Simulate.change(page.nameField, { target: { value: expenseModel.name }});
            TestUtils.Simulate.change(page.priceField, { target: { value: expenseModel.price }});
            TestUtils.Simulate.change(page.payerSelect, { target: { 'options': participantOptions, selectedIndex: 1 }});
            TestUtils.Simulate.submit(page.expenseForm);

            expect(expenseAddForm.props.onSubmit).toHaveBeenCalledWith(expenseModel);
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

            expect(page.errorText.style.display).toEqual('none');
            expect(page.submitButton.disabled).toBeFalsy();
            TestUtils.Simulate.submit(page.expenseForm);

            expect(expenseAddForm.props.onSubmit).toHaveBeenCalledWith(expenseModel);
        });
    });
});