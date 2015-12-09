jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtilsAdditions from 'react-testutils-additions';

const Expense = require('../../../components/expenses/expense.jsx').default;
const TrashButton = require('../../../components/common/trashbutton.jsx').default;
const ActionCreators = require('../../../actions/dataactioncreators').default;
const Utils = require('../../../util/utils');

describe('Component:Expense', () => {
    var expenseTableRow;
    var sheet = { id: '1' };
    var expenseModel = {
        name: 'Beer',
        price: 250,
        participants: [1,2,3],
        payer: 2
    };
    var participants = [
        { id: 1, name: 'Seppo' },
        { id: 2, name: 'Make' },
        { id: 3, name: 'Kake' }
    ];

    beforeEach(() => {
        var Table = React.createClass({
            render: function() {
                return (
                    <table><tbody><Expense expense={expenseModel} participants={participants} isRemoveAllowed={true} sheet={sheet}/></tbody></table>
                );
            }
        });
        var table = TestUtilsAdditions.renderIntoDocument(<Table/>);
        expenseTableRow = TestUtilsAdditions.findRenderedComponentWithType(table, Expense);
    });

    it('Renders participants name', () => {
        // verify name label value
        let cells = TestUtilsAdditions.scryRenderedDOMComponentsWithTag(expenseTableRow, 'td');

        expect(ReactDOM.findDOMNode(cells[0]).textContent).toEqual(expenseModel.name);
        expect(ReactDOM.findDOMNode(cells[1]).textContent).toEqual('' + expenseModel.price);
        expect(ReactDOM.findDOMNode(cells[2]).textContent).toEqual('' + (Utils.NumberUtils.round(expenseModel.price / expenseModel.participants.length, 1)));
        expect(ReactDOM.findDOMNode(cells[3]).textContent).toEqual(participants.map(participant => participant.name).join(', '));
        expect(ReactDOM.findDOMNode(cells[4]).textContent).toEqual(participants[1].name);
    });

    it('should call ActionCreators.removeExpense when remove button is clicked', () => {
        // set up spy
        spyOn(ActionCreators, 'removeExpense');
        // Simulate a click and verify that the action creator is called
        let removeButton = TestUtilsAdditions.findRenderedComponentWithType(expenseTableRow, TrashButton);
        TestUtilsAdditions.Simulate.click(ReactDOM.findDOMNode(removeButton));
        expect(ActionCreators.removeExpense).toHaveBeenCalledWith(expenseModel, sheet.id);
    });
});