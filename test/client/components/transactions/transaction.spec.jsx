import React from 'react';
import {expect} from 'chai';
import {componentRenderer} from '../../support/testhelper';
import {NumberUtils} from 'client/util/utils';
import Transaction from 'components/transactions/transaction.jsx';

describe('Component:Transaction', function() {

    const transactionModel = {
        from: '1',
        to: '2',
        amount: 500
    };

    const participants = [
        { id: '1', name: 'Seppo' },
        { id: '2', name: 'Pertsa' }
    ];


    const renderComponent = componentRenderer(Transaction, { participants, currencySymbol: '$' });

    let component;

    beforeEach(() => component = renderComponent({ transaction: transactionModel }));

    describe('Initial state', function () {

        it('should render the name of the payer', function() {
            expect(component.find('td').at(0)).to.have.text(participants[0].name);
        });

        it('should render the name of the receiver', function() {
            expect(component.find('td').at(2)).to.have.text(participants[1].name);
        });

        it('should render amount with currency symbol', function() {
            expect(component.find('td').at(3)).to.have.text(`${transactionModel.amount} $`);
        });

        it('should display the amount with precision of one decimal', function () {
            const model = {...transactionModel, amount: 2.232323323232323};
            const expected = NumberUtils.round(model.amount, 1);
            const component = renderComponent({ transaction: model });
            expect(component.find('td').at(3)).to.have.text(`${expected} $`);
        });
    });
});