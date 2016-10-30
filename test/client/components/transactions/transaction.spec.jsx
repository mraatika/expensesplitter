import {expect} from 'chai';
import {NumberUtils} from 'util/utils.js';

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
        Transaction = require('components/transactions/transaction.jsx').default;
    });

    const renderRow = (model) => {
        const TableWrapper = React.createClass({
            render: function() {
                return (
                    <table>
                    <tbody>
                        <Transaction transaction={model} participants={participants} currencySymbol="$"/>
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
    };

    beforeEach(function () {
        renderRow(transactionModel);
    });

    describe('Initial state', function () {
        it('should render the transaction\'s name', function() {
            // verify from text
            expect(page.fromCell.textContent).to.equal(participants[0].name);
        });

        it('should render the names of the transaction\'s participants', function() {
            // verify to text
            expect(page.toCell.textContent).to.equal(participants[1].name);
        });

        it('should render transaction\'s amount with currency symbol', function() {
            // verify amount text
            expect(page.amountCell.textContent).to.equal(`${transactionModel.amount} $`);
        });

        it('should display the amount with precision of one decimal', function () {
            const model = Object.assign({}, transactionModel, { amount: 2.232323323232323 });
            const expected = NumberUtils.round(model.amount, 1);
            renderRow(model);
            expect(page.amountCell.textContent).to.equal(`${expected} $`);
        });
    });
});