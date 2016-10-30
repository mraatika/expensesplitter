import {expect} from 'chai';
import sinon from 'sinon';

describe('Component:Expense', () => {
    const jsdom = require('mocha-jsdom');
    const sheet = { id: '1' };
    const page = {};
    const expenseModel = {
        name: 'Beer',
        price: 250,
        participants: [1,2,3],
        payer: 2
    };
    const participants = [
        { id: 1, name: 'Seppo' },
        { id: 2, name: 'Make' },
        { id: 3, name: 'Kake' }
    ];

    let React;
    let ReactDOM;
    let TestUtils;
    let Expense;
    let TrashButton;
    let NumberUtils;
    let expenseTableRow;
    let ActionCreators;

    jsdom();

    before(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        TestUtils = require('react-testutils-additions');
        Expense = require('components/expenses/expense.jsx').default;
        TrashButton = require('components/common/trashbutton.jsx').default;
        NumberUtils = require('util/utils').NumberUtils;
        ActionCreators = require('actions/dataactioncreators.js').default;
    });

    const renderExpense = (props = {}) => {
        props = Object.assign({
            expense: expenseModel,
            participants,
            isRemoveAllowed: true,
            sheet
        }, props);

        const Table = React.createClass({
            render: function() {
                return (
                    <table><tbody><Expense {...props}/></tbody></table>
                );
            }
        });
        const tableNode = TestUtils.renderIntoDocument(<Table/>);
        expenseTableRow = TestUtils.findRenderedComponentWithType(tableNode, Expense);

        page.cells = TestUtils.scryRenderedDOMComponentsWithTag(expenseTableRow, 'td');
    };

    beforeEach(() => {
        renderExpense();
    });

    describe('Initial state', function () {
        it('should render expenses\'s name', () => {
            expect(ReactDOM.findDOMNode(page.cells[0]).textContent).to.equal(expenseModel.name);
        });

        it('should render expenses\'s price', () => {
            expect(ReactDOM.findDOMNode(page.cells[1]).textContent).to.equal('' + expenseModel.price);
        });

        it('should render each participant\'s share rounded to one decimal', () => {
            expect(ReactDOM.findDOMNode(page.cells[2]).textContent).to.equal('' + (NumberUtils.round(expenseModel.price / expenseModel.participants.length, 1)));
        });

        it('should render names of all of the participants', () => {
            expect(ReactDOM.findDOMNode(page.cells[3]).textContent).to.equal(participants.map(participant => participant.name).join(', '));
        });

        it('should render payer\'s name', () => {
            expect(ReactDOM.findDOMNode(page.cells[4]).textContent).to.equal(participants[1].name);
        });

        it('should render a remove button when removing is allowed', function () {
            // should find such element and not to throw an exception
            expect(() => TestUtils.findRenderedComponentWithType(expenseTableRow, TrashButton)).not.to.throw();
        });

        it('should not render a remove button when removing is disallowed', function () {
            renderExpense({ isRemoveAllowed: false });
            // should throw an error bc TestUtils can't find such element
            expect(() => TestUtils.findRenderedComponentWithType(expenseTableRow, TrashButton)).to.throw();
        });
    });

    describe('Removing expense', function () {
        it('should call ActionCreators.removeExpense when remove button is clicked', () => {
            const removeButton = TestUtils.findRenderedComponentWithType(expenseTableRow, TrashButton);
            sinon.spy(ActionCreators, 'removeExpense');
            // Simulate a click and verify that the action creator is called
            TestUtils.Simulate.click(ReactDOM.findDOMNode(removeButton));
            expect(ActionCreators.removeExpense.calledWith(expenseModel, sheet.id)).to.be.ok;
            ActionCreators.removeExpense.restore();
        });
    });
});