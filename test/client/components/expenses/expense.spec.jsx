import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {NumberUtils} from 'util/utils';
import Expense from 'components/expenses/expense.jsx';
import TrashButton from 'components/common/trashbutton.jsx';
import {componentRenderer} from '../../support/testhelper';

describe('Component:Expense', () => {

    const defaultProps = {
        expense: {
            name: 'Beer',
            price: 250,
            participants: [1,2,3],
            payer: 2
        },
        participants: [
            { id: 1, name: 'Seppo' },
            { id: 2, name: 'Make' },
            { id: 3, name: 'Kake' }
        ],
        isRemoveAllowed: true,
        removeExpenses: sinon.spy()
    };

    const renderComponent = componentRenderer(Expense, defaultProps);

    describe('Initial state', function () {
        let component;

        beforeEach(() => component = renderComponent());

        it('should render expenses\'s name', () => {
            expect(component.find('td').at(0)).to.have.text(defaultProps.expense.name);
        });

        it('should render expenses\'s price', () => {
            expect(component.find('td').at(1)).to.have.text('' + defaultProps.expense.price);
        });

        it('should render each participant\'s share rounded to one decimal', () => {
            expect(component.find('td').at(2)).to.have.text('' + (NumberUtils.round(defaultProps.expense.price / defaultProps.expense.participants.length, 1)));
        });

        it('should render names of all of the participants', () => {
            expect(component.find('td').at(3)).to.have.text(defaultProps.participants.map(participant => participant.name).join(', '));
        });

        it('should render payer\'s name', () => {
            expect(component.find('td').at(4)).to.have.text(defaultProps.participants[1].name);
        });

        it('should render a remove button when removing is allowed', function () {
            expect(component).to.have.exactly(1).descendants(TrashButton);
        });

        it('should not render a remove button when removing is disallowed', function () {
            const _component = renderComponent({ isRemoveAllowed: false });
            expect(_component).not.to.have.descendants(TrashButton);
        });
    });

    describe('Removing expense', function () {
        it('should call removeExpense prop when remove button is clicked', () => {
            const component = renderComponent();
            const removeButton = component.find(TrashButton);

            removeButton.simulate('click');

            expect(defaultProps.removeExpenses).to.have.been.calledWith(defaultProps.expense);
        });
    });
});