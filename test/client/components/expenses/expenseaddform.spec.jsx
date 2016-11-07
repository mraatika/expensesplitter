import React from 'react';
import {expect} from 'chai';
import {range} from 'lodash';
import sinon from 'sinon';
import {t} from 'common/dictionary/dictionary';
import MessageContainer from 'client/components/common/messagecontainer.jsx';
import {componentRenderer, componentMounter} from '../../support/testhelper';
import ExpenseAddForm from 'components/expenses/expenseaddform.jsx';

describe('Component:ExpenseAddForm', function() {

    const defaultProps = {
        participants: [
            {id: 1, name: 'Seppo'},
            {id: 2, name: 'Kake'},
            {id: 3, name: 'Jorma'}
        ],
        expenses: [],
        onSubmit: new Function()
    };

    const renderComponent = componentRenderer(ExpenseAddForm, defaultProps);
    const mountComponent = componentMounter(ExpenseAddForm, defaultProps);

    describe('Rendering', function () {
        it('should have default values set', function () {
            const component = renderComponent();
            const {participants} = defaultProps;
            expect(component.find('#expense-name')).to.have.value('');
            expect(component.find('#expense-price')).to.have.value('');
            expect(component.find('#expense-participants').prop('value')).to.be.a('array');
            expect(component.find('#expense-payer')).to.have.value('' + participants[0].id);
        });

        it('should display an error when current sheet doesn\'t contain any participants', function () {
            const component = renderComponent({ participants: [] });
            const message = component.find(MessageContainer);
            expect(message.dive()).to.contain.text(t('expenseaddform.error.participants'));
            expect(component.find('button[type="submit"]')).to.be.disabled();
        });
    });

    describe('Validating', function () {

        describe('name', function () {
            it('should require a name', function (done) {
                const component = mountComponent();
                const field = component.find('#expense-name');
                const message = component.find(MessageContainer);

                field.simulate('change', { target: { value: '' }});

                setTimeout(() => {
                    expect(message).to.contain.text(t('error.expense.name.required'));
                    expect(field).to.have.className('error');
                    done();
                }, 200);
            });

            it('should require name to contain less than 100 characters', function (done) {
                const component = mountComponent();
                const field = component.find('#expense-name');
                const message = component.find(MessageContainer);

                field.simulate('change', {target: { value: range(0, 100).join('') }});

                setTimeout(() => {
                    expect(message).to.contain.text(t('error.expense.name.maxLength'));
                    expect(field).to.have.className('error');
                    done();
                }, 200);
            });
        });

        describe('price', function () {
            it('should require a price', function (done) {
                const component = mountComponent();
                const field = component.find('#expense-price');
                const message = component.find(MessageContainer);

                field.simulate('change');

                setTimeout(() => {
                    expect(message).to.contain.text(t('error.expense.price.required'));
                    expect(field).to.have.className('error');
                    done();
                }, 105);
            });

            it('should require price to be greater than 0', function (done) {
                const component = mountComponent();
                const field = component.find('#expense-price');
                const message = component.find(MessageContainer);

                field.simulate('change', { target: { value: 0 }});

                setTimeout(() => {
                    expect(message).to.contain.text(t('error.expense.price.min'));
                    expect(field).to.have.className('error');
                    done();
                }, 105);
            });

            it('should require price less than 1000000', function (done) {
                const component = mountComponent();
                const field = component.find('#expense-price');
                const message = component.find(MessageContainer);

                field.simulate('change', { target: { value: 1000001 }});

                setTimeout(() => {
                    expect(message).to.contain.text(t('error.expense.price.max'));
                    expect(field).to.have.className('error');
                    done();
                }, 105);
            });
        });
    });

    describe('Selecting a default payer', function () {
        const expenseModel = {
            name: 'Beer',
            price: 150,
            participants: [ 2 ],
            payer: 2
        };

        const participantOptions = defaultProps.participants.map(function(p) {
            return { value: p.id, selected: p.id === expenseModel.payer };
        });

        it('should keep current payer as default', function () {
            const {participants} = defaultProps;
            const spy = sinon.spy();
            const component = mountComponent({ onSubmit: spy });
            const field = component.find('#expense-payer');

            component.setState({ expense: expenseModel });

            component.simulate('submit');
            expect(spy).to.have.been.calledWith(expenseModel);

            expect(field).to.have.value('' + participants[1].id);
            expect(component.state('expense').payer).to.equal(participants[1].id);

            // this time without changing the payer select
            component.find('#expense-name').simulate('change', { target: { value: expenseModel.name }});
            component.find('#expense-price').simulate('change', { target: { value: expenseModel.price }});
            component.find('#expense-participants').simulate('change', { target: { options: participantOptions }});
            component.simulate('submit');

            expect(spy).to.have.been.calledWith(expenseModel);
            expect(component.find('#expense-payer')).to.have.value('' + participants[1].id);
            expect(component.state('expense').payer).to.equal(participants[1].id);
        });
    });

    describe('Selecting default participants', function () {
        const spy = sinon.spy();
        const expenseModel = {
            name: 'Beer',
            price: 150,
            participants: [ 1, 2 ],
            payer: 2
        };

        it('should keep current participants as default', function () {
            const component = mountComponent({ onSubmit: spy });
            component.setState({ expense: expenseModel });

            component.simulate('submit');
            expect(spy).to.have.been.calledWith(expenseModel);

            expect(component.find('#expense-participants').prop('value')).to.deep.equal([ 1,2 ]);
            expect(component.state('expense').participants).to.deep.equal([ 1, 2 ]);

            // this time without changing the participants selection
            component.find('#expense-name').simulate('change', { target: { value: expenseModel.name }});
            component.find('#expense-price').simulate('change', { target: { value: expenseModel.price }});
            component.simulate('submit');

            expect(spy.calledWith(expenseModel)).to.be.ok;
        });
    });

    describe('form submit', function () {
        const expenseModel = {
            name: 'Beer',
            price: '1000',
            participants: [1, 2, 3],
            payer: 1
        };

        it('should call ActionCreators.addExpense with expense model when submitting a valid form', function (done) {
            const spy = sinon.spy();
            const component = mountComponent({ onSubmit: spy });
            const message = component.find(MessageContainer);
            const participantOptions = defaultProps.participants.map(function(p) {
                return { value: p.id, selected: true };
            });

            component.find('#expense-name').simulate('change', { target: { value: expenseModel.name }});
            component.find('#expense-price').simulate('change', { target: { value: expenseModel.price }});
            component.find('#expense-participants').simulate('change', { target: { options: participantOptions }});
            component.find('#expense-payer').simulate('change', { target: { options: participantOptions, selectedIndex: 0 }});

            setTimeout(() => {
                expect(message).to.have.style('display', 'none');
                expect(component.find('button[type="submit"]')).not.to.be.disabled();
                component.simulate('submit');
                expect(spy).to.have.been.calledWith(expenseModel);
                done();
            }, 105);
        });
    });
});