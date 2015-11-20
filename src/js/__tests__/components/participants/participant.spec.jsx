jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-testutils-additions';

const Participant = require('../../../components/participants/participant.jsx').default;
const ActionCreators = require('../../../actions/dataactioncreators').default;
const ExpensesService = require('../../../service/expensesservice').default;

describe('Component:Participant', function() {
    var participantListItem;
    var participantModel = {
        id: 'id1',
        name: 'Seppo'
    };

    var page = {};

    const renderListItem = (sheet) => {
        var ListWrapper = React.createClass({
            render: function() {
                return (
                    <ul><Participant participant={participantModel} sheet={sheet} /></ul>
                );
            }
        });
        var list = TestUtils.renderIntoDocument(<ListWrapper/>);
        participantListItem = TestUtils.findRenderedComponentWithType(list, Participant);
        page.removeButton = TestUtils.findRenderedDOMComponentWithClass(participantListItem, 'icon-button');
    };

    describe('Rendering a participant list row', function () {
        beforeEach(function () {
            renderListItem({});
        });

        it('Renders participants name', function() {
            // verify name label value
            var label = TestUtils.findRenderedDOMComponentWithClass(participantListItem, 'participant-list-participant');
            expect(label.textContent).toEqual(participantModel.name);
        });
    });

    describe('Removing a participant', function () {
        var sheet = {
            expenses: []
        };

        beforeEach(function () {
            renderListItem(sheet);
        });

        it('should call ActionCreators.removeParticipant when remove button is clicked', function () {
            // set up spy
            spyOn(ActionCreators, 'removeParticipant');
            // Simulate a click and verify that the action creator is called
            TestUtils.Simulate.click(page.removeButton);
            expect(ActionCreators.removeParticipant).toHaveBeenCalledWith(participantModel);
        });

        it('should ask for confirmation when the participant has expenses participated in', function () {
            let dialog = participantListItem.refs.removeConfirmationDialog;

            spyOn(ExpensesService.prototype, 'findExpensesByParticipant').andReturn([1]);
            spyOn(ExpensesService.prototype, 'findExpensesPaidByParticipant').andReturn([]);
            spyOn(ActionCreators, 'removeParticipant');

            TestUtils.Simulate.click(page.removeButton);

            expect(dialog.state.showModal).toEqual(true);

            expect(ActionCreators.removeParticipant).not.toHaveBeenCalled();
        });

        it('should ask for confirmation when there are expenses paid by the given participant', function () {
            let dialog = participantListItem.refs.removeConfirmationDialog;

            spyOn(ExpensesService.prototype, 'findExpensesByParticipant').andReturn([]);
            spyOn(ExpensesService.prototype, 'findExpensesPaidByParticipant').andReturn([1]);
            spyOn(ActionCreators, 'removeParticipant');

            TestUtils.Simulate.click(page.removeButton);

            expect(dialog.state.showModal).toEqual(true);

            expect(ActionCreators.removeParticipant).not.toHaveBeenCalled();

            // buttons are transfered to dialog in properties
            dialog.props.buttons[0].click();

            expect(ActionCreators.removeParticipant).toHaveBeenCalledWith(participantModel);
        });
    });
});