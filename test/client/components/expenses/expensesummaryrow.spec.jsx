import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import ExpenseSummaryRow from 'components/expenses/expensesummaryrow.jsx';
import RemovalConfirmationDialog from 'client/components/common/removalconfirmationdialog.jsx';
import {componentRenderer} from '../../support/testhelper';

describe('Component:ExpenseSummaryRow', function() {

    const expenses = [
        {
            name: 'Beer',
            price: 250,
            participants: [1,2,3],
            payer: 2
        },
        {
            name: 'Food',
            price: 125,
            participants: [1,2,3],
            payer: 1
        },
        {
            name: 'Gas',
            price: 75,
            participants: [1,2],
            payer: 2
        }
    ];

    const defaultProps = {
        currencySymbol: '$',
        expenses,
        isRemoveAllowed: true,
        removeExpenses: sinon.stub()
    };

    const renderComponent = componentRenderer(ExpenseSummaryRow, defaultProps);

    describe('state when expenses are not empty', () => {
        it('should display the total amount of expenses with currencySymbol', () => {
            const component = renderComponent();
            const totalSum = expenses.reduce(((memo, e) => memo + e.price), 0);
            expect(component.find('td').at(1)).to.have.text(`${totalSum} ${defaultProps.currencySymbol}`);
        });

        it('should display the remove button when removing is allowed', function () {
            const component = renderComponent();
            expect(component).to.have.exactly(1).descendants('button');
        });

        it('should display the remove all button enabled', function () {
            const component = renderComponent();
            const removeButton = component.find('button');
            expect(removeButton).not.to.be.disabled();
        });

        it('should not display the remove button when removing is disallowed', function () {
            const component = renderComponent({ isRemoveAllowed: false });
            expect(component).not.to.have.descendants('button');
        });
    });

    describe('State when expenses are empty', function () {
        it('should total sum of 0 with currencySymbol', function () {
            const component = renderComponent({ expenses: [] });
            expect(component.find('td').at(1)).to.have.text(`0 ${defaultProps.currencySymbol}`);
        });

        it('should display the remove all button disabled', function () {
            const component = renderComponent({ expenses: [] });
            const removeButton = component.find('button');
            expect(removeButton).to.be.disabled();
        });
    });

    describe('Removing all expenses', function () {
        let component;

        beforeEach(() => component = shallow(<ExpenseSummaryRow {...defaultProps} />));

        it('should have a confirmation dialog as a descendant', function () {
            expect(component).to.have.exactly(1).descendants(RemovalConfirmationDialog);
        });

        it('should call removeAll when removal is confirmed', function () {
            const dialog = component.find(RemovalConfirmationDialog);

            // invoke dialog's confirmation callback
            dialog.prop('onRemoveConfirmed').call();

            expect(defaultProps.removeExpenses).to.have.been.called;
        });
    });
});