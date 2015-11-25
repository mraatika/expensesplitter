jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-testutils-additions';
import _ from 'lodash';

const ExpenseSummaryRow = require('../../../components/expenses/expensesummaryrow.jsx').default;
const ActionCreators = require('../../../actions/dataactioncreators').default;
const RemovalConfirmationDialog = require('../../../components/common/removalconfirmationdialog.jsx').default;
const ModalDialog = require('../../../components/common/modaldialog.jsx').ModalDialog;

describe('Component:ExpenseSummaryRow', function() {
    let expenseTableRow;
    const page = {};
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

    beforeEach(function () {
        var Table = React.createClass({
            render: function() {
                return (
                    <table><tbody><ExpenseSummaryRow expenses={expenses} isRemoveAllowed={true} settings={{}}/></tbody></table>
                );
            }
        });
        var table = TestUtils.renderIntoDocument(<Table/>);
        expenseTableRow = TestUtils.findRenderedComponentWithType(table, ExpenseSummaryRow);
        page.removeButton = TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button');
    });

    it('should display the total amount of expenses', function() {
        // verify name label value
        var cells = TestUtils.scryRenderedDOMComponentsWithTag(expenseTableRow, 'td');
        var totalSum = _.reduce(expenses, ((memo, e) => memo + e.price), 0);
        expect(+cells[1].textContent).toEqual(totalSum);
    });

    it('should display a confirmation dialog when clicking the remove all button', function () {
        TestUtils.Simulate.click(page.removeButton);
        const dialog = TestUtils.findRenderedComponentWithType(expenseTableRow, RemovalConfirmationDialog);
        expect(dialog._modal.state.showModal).toEqual(true);
    });

    it('should call ActionCreators.removeAllExpenses when remove all button is clicked', function () {
        // set up spy
        spyOn(ActionCreators, 'removeAllExpenses');
        // Simulate a click and verify that the action creator is called
        TestUtils.Simulate.click(page.removeButton);
        const modal = TestUtils.findRenderedComponentWithType(expenseTableRow, ModalDialog);
        // "click" the confirm button
        modal.props.buttons[0].click();
        expect(ActionCreators.removeAllExpenses).toHaveBeenCalled();
    });
});