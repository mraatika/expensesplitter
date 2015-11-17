jest.autoMockOff();

import React from 'react';
import TestUtils from 'react-testutils-additions';

const Transaction = require('../../../components/transactions/transaction.jsx').Transaction;

describe('Component:Transaction', function() {
    var transactionListItem;
    var transactionModel = {
        from: '1',
        to: '2',
        amount: 500
    };
    var participants = [
        { id: '1', name: 'Seppo' },
        { id: '2', name: 'Pertsa' }
    ];

    beforeEach(function () {
        var ListWrapper = React.createClass({
            render: function() {
                return (
                    <ul><Transaction transaction={ transactionModel } participants={ participants }/></ul>
                );
            }
        });
        var list = TestUtils.renderIntoDocument(<ListWrapper/>);
        transactionListItem = TestUtils.findRenderedComponentWithType(list, Transaction);
    });

    it('Renders transaction\'s from attribute (participant name)', function() {
        // verify name label value
        var label = TestUtils.findRenderedDOMComponentWithClass(transactionListItem, 'transactions-list-from');
        expect(label.textContent).toEqual(participants[0].name);
    });

    it('Renders transaction\'s to attribute (participant name)', function() {
        // verify name label value
        var label = TestUtils.findRenderedDOMComponentWithClass(transactionListItem, 'transactions-list-to');
        expect(label.textContent).toEqual(participants[1].name);
    });

    it('Renders transaction\'s amount', function() {
        // verify name label value
        var label = TestUtils.findRenderedDOMComponentWithClass(transactionListItem, 'transactions-list-amount');
        expect(label.textContent).toEqual('' + transactionModel.amount);
    });
});