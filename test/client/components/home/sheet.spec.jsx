import {expect} from 'chai';
import sinon from 'sinon';

import {t} from 'dictionary/dictionary.js';
import {DateUtils} from 'util/utils.js';

describe('Component:Sheet', function() {
    const jsdom = require('mocha-jsdom');
    const sheet = {
        id: 'id1',
        name: 'Seppo',
        createdOn: new Date(1,0,2015)
    };

    let React;
    let ReactDOM;
    let TestUtils;
    let Sheet;
    let sheetListItem;

    jsdom();

    const renderComponent = function(isCurrentSheet, props) {
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

    before(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        TestUtils = require('react-testutils-additions');
        Sheet = require('components/home/sheet.jsx').default;
    });

    describe('Initial state', function () {
        beforeEach(function () {
            renderComponent(false);
        });

        it('should render sheet\'s name', function() {
            var label = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'sheet-list-name');
            expect(label.textContent).to.equal(sheet.name);
        });

        it('should render sheet\'s name', function() {
            var label = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'sheet-list-date');
            expect(label.textContent).to.equal(DateUtils.format(sheet.createdOn, t('app.locales.date_format')));
        });
    });

    describe('Marking the current sheet', function () {
        it('should mark the current sheet with a check marker', function () {
            var marker = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'fa-check-circle-o');
            expect(marker.className.indexOf('hidden')).not.to.equal(-1);

            renderComponent(true);

            expect(ReactDOM.findDOMNode(sheetListItem).className.indexOf('active')).to.equal(-1);
        });
    });

    describe('Removing a sheet', function () {
        it('should call remove callback when remove button is clicked', function () {
            const spy = sinon.spy();
            renderComponent(false, { onRemoveClick: spy });
            // set up spy
            // Simulate a click and verify that the action creator is called
            var removeButton = TestUtils.findRenderedDOMComponentWithClass(sheetListItem, 'icon-button');
            TestUtils.Simulate.click(removeButton);
            expect(spy.callCount).to.equal(1);
            expect(spy.calledWithExactly(sheet)).to.equal(true);
        });
    });
});