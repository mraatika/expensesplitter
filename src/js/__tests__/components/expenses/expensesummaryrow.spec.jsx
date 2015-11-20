jest.autoMockOff();

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-testutils-additions';
import _ from 'lodash';

const ExpenseSummaryRow = require('../../../components/expenses/expensesummaryrow.jsx').default;
const ActionCreators = require('../../../actions/dataactioncreators').default;

describe('Component:ExpenseSummaryRow', function() {
    var expenseTableRow;
    var expenses = [
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
                    <table><tbody><ExpenseSummaryRow expenses={expenses} isRemoveAllowed={true}/></tbody></table>
                );
            }
        });
        var table = TestUtils.renderIntoDocument(<Table/>);
        expenseTableRow = TestUtils.findRenderedComponentWithType(table, ExpenseSummaryRow);
    });

    it('should display the total amount of expenses', function() {
        // verify name label value
        var cells = TestUtils.scryRenderedDOMComponentsWithTag(expenseTableRow, 'td');
        var totalSum = _.reduce(expenses, ((memo, e) => memo + e.price), 0);
        expect(+cells[1].textContent).toEqual(totalSum);
    });

    it('should call ActionCreators.removeAllExpenses when remove all button is clicked', function () {
        // set up spy
        spyOn(ActionCreators, 'removeAllExpenses');
        // Simulate a click and verify that the action creator is called
        var removeButton = TestUtils.findRenderedDOMComponentWithTag(expenseTableRow, 'button');
        TestUtils.Simulate.click(removeButton);
        expect(ActionCreators.removeAllExpenses).toHaveBeenCalled();
    });
});