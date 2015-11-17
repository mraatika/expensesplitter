jest.autoMockOff();

import React from 'react';
import TestUtils from 'react-testutils-additions';

const Share = require('../../../components/shares/share.jsx').Share;
const Utils = require('../../../util/utils');

describe('Component:Share', function() {
    var shareListItem;
    var shareModel = {
        participantName: 'Seppo',
        amount: 200.32123,
        balance: -500.23958
    };

    var renderItem = function(_shareModel) {
        var Table = React.createClass({
            render: function() {
                return (
                    <table><tbody><Share share={_shareModel} /></tbody></table>
                );
            }
        });
        var table = TestUtils.renderIntoDocument(<Table/>);
        shareListItem = TestUtils.findRenderedComponentWithType(table, Share);
    };

    beforeEach(function () {
        renderItem(shareModel);
    });

    it('should display participant\'s name', function() {
        var label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-participant');
        expect(label.textContent).toEqual(shareModel.participantName);
    });

    it('should display participant\'s share amount rounded to one decimal', function() {
        var label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-share-amount');
        expect(label.textContent).toEqual('' + (Utils.Number.round(shareModel.amount, 1)));
    });

    it('should display participant\'s balance rounded to one decimal', function() {
        var label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.textContent).toEqual('' + (Utils.Number.round(shareModel.balance, 1)));
    });

    it('should add class "negative" to balance label if participant\'s balance is negative', function() {
        var label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.className.indexOf('negative')).not.toEqual(-1);
    });

    it('should add class "positive" to balance label if participant\'s balance is positive', function() {
        // update share model and re-render with updated model
        shareModel.balance = 50;
        renderItem(shareModel);

        var label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.className.indexOf('positive')).not.toEqual(-1);
    });

    it('should not add classes to balance label if participant\'s balance is 0', function() {
        // update share model and re-render with updated model
        shareModel.balance = 0;
        renderItem(shareModel);

        var label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.className.indexOf('negative')).toEqual(-1);
        expect(label.className.indexOf('positive')).toEqual(-1);
    });
});