jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-testutils-additions';
import sinon from 'sinon';

const Participant = require('../../../components/participants/participant.jsx').default;

describe('Component:Participant', function() {
    var participantListItem;
    var participantModel = {
        id: 'id1',
        name: 'Seppo'
    };

    var page = {};

    const renderListItem = (sheet, props) => {
        var ListWrapper = React.createClass({
            render: function() {
                return (
                    <ul><Participant participant={participantModel} sheet={sheet} {...props} /></ul>
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

        it('should call given callback when remove button is clicked', function () {
            const spy = sinon.spy();
            renderListItem(sheet, { onRemoveClick: spy });
            // Simulate a click and verify that the action creator is called
            TestUtils.Simulate.click(page.removeButton);
            expect(spy.callCount).toEqual(1);
            expect(spy.calledWithExactly(participantModel)).toEqual(true);
        });
    });
});