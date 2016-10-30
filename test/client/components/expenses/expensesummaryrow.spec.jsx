import {expect} from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

describe('Component:ExpenseSummaryRow', function() {
    const proxyquire = require('proxyquire').noCallThru();
    const jsdom = require('mocha-jsdom');
    const page = {};
    const sheet = { id: '1' };
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
        expenses,
        isRemoveAllowed: true,
        sheet,
        currencySymbol: '$'
    };

    let expenseTableRow;
    let React;
    let TestUtils;
    let ExpenseSummaryRow;
    let ActionCreators;
    let RemovalConfirmationDialogStub;

    jsdom();

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        ActionCreators = require('../../../src/js/actions/dataactioncreators').default;

        RemovalConfirmationDialogStub = React.createClass({
            render: () => null,
            open: () => {},
            close: () => {}
        });

        ExpenseSummaryRow = proxyquire('../../../src/js/components/expenses/expensesummaryrow.jsx', {
            '../common/removalconfirmationdialog.jsx': RemovalConfirmationDialogStub
        }).default;
    });

    const renderSummaryRow = (props = {}) => {
        props = Object.assign({}, defaultProps, props);

        const Table = React.createClass({
            render: () => {
                return (
                    <table><tbody><ExpenseSummaryRow {...props} /></tbody></table>
                );
            }
        });

        const tableNode = TestUtils.renderIntoDocument(<Table/>);
        expenseTableRow = TestUtils.findRenderedComponentWithType(tableNode, ExpenseSummaryRow);
        page.cells = TestUtils.scryRenderedDOMComponentsWithTag(expenseTableRow, 'td');
    };


    describe('Initial state', () => {
        it('should display the total amount of expenses with currencySymbol', () => {
            renderSummaryRow();
            const totalSum = _.reduce(expenses, ((memo, e) => memo + e.price), 0);
            expect(page.cells[1].textContent).to.equal(`${totalSum} ${defaultProps.currencySymbol}`);
        });

        it('should display the remove all button enabled when expenses list is not empty', function () {
            const removeButton = TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button');
            expect(removeButton.disabled).not.to.be.ok;
        });

        it('should display the remove button when removing is allowed', function () {
            renderSummaryRow();
            expect(() => TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button')).not.to.throw();
        });

        it('should not display the remove button when removing is disallowed', function () {
            renderSummaryRow({ isRemoveAllowed: false });
            expect(() => TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button')).to.throw();
        });

        it('should display the remove all button disabled when the expenses list is empty ', function () {
            renderSummaryRow({ expenses: [] });
            const removeButton = TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button');
            expect(removeButton.disabled).to.be.ok;
        });
    });

    describe('Removing all the expenses', () => {
        beforeEach(() => renderSummaryRow());

        it('should display a confirmation dialog when clicking the remove all button', () => {
            const removeButton = TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button');
            sinon.spy(expenseTableRow._removalConfirmationDialog, 'open');
            TestUtils.Simulate.click(removeButton);
            expect(expenseTableRow._removalConfirmationDialog.open.called).to.be.ok;
        });

        it('should call ActionCreators.removeAllExpenses when remove all button is clicked', () => {
            const removeButton = TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button');
            // set up spy
            sinon.spy(ActionCreators, 'removeAllExpenses');
            // Simulate a click and verify that the action creator is called
            TestUtils.Simulate.click(removeButton);
            // "click" the confirm button
            expenseTableRow._removalConfirmationDialog.props.onRemoveConfirmed();
            expect(ActionCreators.removeAllExpenses.calledWith(sheet.id)).to.be.ok;
            ActionCreators.removeAllExpenses.restore();
        });
    });
});