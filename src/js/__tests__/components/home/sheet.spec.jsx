jest.dontMock('../../../components/home/sheet.jsx');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-testutils-additions';
import sinon from 'sinon';

const Sheet = require('../../../components/home/sheet.jsx').default;

describe('Component:Sheet', function() {
    var sheetListItem;
    var sheet = {
        id: 'id1',
        name: 'Seppo',
        createdOn: new Date(1,0,2015)
    };

    var renderComponent = function(isCurrentSheet, props) {
        var ListWrapper = React.createClass({
            render: function() {
                return (
                    <ul><Sheet sheet={sheet} isCurrentSheet={isCurrentSheet} {...props} /></ul>
                );
            }
        });
        var list = TestUtils.renderIntoDocument(<ListWrapper/>);
        sheetListItem = TestUtils.findRenderedComponentWithType(list, Sheet);
    };

    beforeEach(function () {
        renderComponent(false);
    });

    it('should render sheet\'s name', function() {
        var label = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'sheet-list-name');
        expect(label.textContent).toEqual(sheet.name);
    });

    it('should render sheet\'s name', function() {
        var label = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'sheet-list-date');
        expect(label.textContent).toEqual(sheet.createdOn.toLocaleString());
    });

    it('should mark the current sheet with a marker', function () {
        var marker = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'fa-check-circle-o');
        expect(marker.className.indexOf('hidden')).not.toEqual(-1);

        renderComponent(true);

        expect(ReactDOM.findDOMNode(sheetListItem).className.indexOf('active')).toEqual(-1);
    });

    it('should call remove callback when remove button is clicked', function () {
        const spy = sinon.spy();
        renderComponent(false, { onRemoveClick: spy });
        // set up spy
        // Simulate a click and verify that the action creator is called
        var removeButton = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'icon-button');
        TestUtils.Simulate.click(removeButton);
        expect(spy.callCount).toEqual(1);
        expect(spy.calledWithExactly(sheet)).toEqual(true);
    });
});