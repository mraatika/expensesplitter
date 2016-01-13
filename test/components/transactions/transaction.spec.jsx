import {expect} from 'chai';

describe('Component:Transaction', function() {
    const jsdom = require('mocha-jsdom');

    let React;
    let ReactDOM;
    let TestUtils;
    let Transaction;

    jsdom();

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

    before(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        TestUtils = require('react-testutils-additions');
        Transaction = require('../../../src/js/components/transactions/transaction.jsx').default;
    });

    beforeEach(function () {
        const TableWrapper = React.createClass({
            render: function() {
                return (
                    <table>
                    <tbody>
                        <Transaction transaction={ transactionModel } participants={ participants } currencySymbol="$"/>
                    </tbody>
                    </table>
                );
            }
        });
        const table = TestUtils.renderIntoDocument(<TableWrapper/>);
        transactionItem = TestUtils.findRenderedComponentWithType(table, Transaction);

        let cells = TestUtils.scryRenderedDOMComponentsWithTag(transactionItem, 'td');
        page.fromCell = ReactDOM.findDOMNode(cells[0]);
        page.toCell = ReactDOM.findDOMNode(cells[2]);
        page.amountCell = ReactDOM.findDOMNode(cells[3]);
    });

    it('Renders transaction\'s from attribute (participant name)', function() {
        // verify from text
        expect(page.fromCell.textContent).to.equal(participants[0].name);
    });

    it('Renders transaction\'s to attribute (participant name)', function() {
        // verify to text
        expect(page.toCell.textContent).to.equal(participants[1].name);
    });

    it('Renders transaction\'s amount with currency symbol', function() {
        // verify amount text
        expect(page.amountCell.textContent).to.equal(`${transactionModel.amount} $`);
    });
});