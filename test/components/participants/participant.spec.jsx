import {expect} from 'chai';
import sinon from 'sinon';

describe('Component:Participant', function() {
    const jsdom = require('mocha-jsdom');

    let React;
    let TestUtils;

    let Participant;
    let participantListItem;
    let participantModel = {
        id: 'id1',
        name: 'Seppo'
    };

    let page = {};

    jsdom();

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        Participant = require('../../../src/js/components/participants/participant.jsx').default;
    });

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
        it('Renders participants name', function() {
            renderListItem({});
            // verify name label value
            var label = TestUtils.findRenderedDOMComponentWithClass(participantListItem, 'participant-list-participant');
            expect(label.textContent).to.equal(participantModel.name);
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
            expect(spy.callCount).to.equal(1);
            expect(spy.calledWithExactly(participantModel)).to.be.ok;
        });
    });
});