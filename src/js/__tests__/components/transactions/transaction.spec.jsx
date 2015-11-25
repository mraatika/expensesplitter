jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-testutils-additions';

const Transaction = require('../../../components/transactions/transaction.jsx').default;

describe('Component:Transaction', function() {
    let transactionItem;
    let transactionModel = {
        from: '1',
        to: '2',
        amount: 500
    };
    let participants = [
        { id: '1', name: 'Seppo' },
        { id: '2', name: 'Pertsa' }
    ];
    let page = {};
    let settings= {
        currencySymbol: '$'
    };

    beforeEach(function () {
        var TableWrapper = React.createClass({
            render: function() {
                return (
                    <table>
                    <tbody>
                        <Transaction transaction={ transactionModel } participants={ participants } settings={settings}/>
                    </tbody>
                    </table>
                );
            }
        });
        var table = TestUtils.renderIntoDocument(<TableWrapper/>);
        transactionItem = TestUtils.findRenderedComponentWithType(table, Transaction);

        let cells = TestUtils.scryRenderedDOMComponentsWithTag(transactionItem, 'td');
        page.fromCell = ReactDOM.findDOMNode(cells[0]);
        page.toCell = ReactDOM.findDOMNode(cells[2]);
        page.amountCell = ReactDOM.findDOMNode(cells[3]);
    });

    it('Renders transaction\'s from attribute (participant name)', function() {
        // verify from text
        expect(page.fromCell.textContent).toEqual(participants[0].name);
    });

    it('Renders transaction\'s to attribute (participant name)', function() {
        // verify to text
        expect(page.toCell.textContent).toEqual(participants[1].name);
    });

    it('Renders transaction\'s amount with currency symbol', function() {
        // verify amount text
        expect(page.amountCell.textContent).toEqual(`${transactionModel.amount} ${settings.currencySymbol}`);
    });
});