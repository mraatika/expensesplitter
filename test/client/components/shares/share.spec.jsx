import {expect} from 'chai';
import {NumberUtils} from '../../../src/js/util/utils.js';

describe('Component:Share', function() {
    const jsdom = require('mocha-jsdom');
    const shareModel = {
        participantName: 'Seppo',
        amount: 200.32123,
        balance: -500.23958
    };

    let Share;
    let React;
    let TestUtils;
    let shareListItem;

    jsdom();

    var renderItem = function(_shareModel) {
        var Table = React.createClass({
            render: function() {
                return (
                    <table><tbody><Share share={_shareModel} /></tbody></table>
                );
            }
        });
        const table = TestUtils.renderIntoDocument(<Table/>);
        shareListItem = TestUtils.findRenderedComponentWithType(table, Share);
    };

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        Share = require('../../../src/js/components/shares/share.jsx').default;
    });

    beforeEach(function () {
        renderItem(shareModel);
    });

    it('should display participant\'s name', function() {
        const label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-participant');
        expect(label.textContent).to.equal(shareModel.participantName);
    });

    it('should display participant\'s share amount rounded to one decimal', function() {
        const label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-share-amount');
        expect(label.textContent).to.equal('' + (NumberUtils.round(shareModel.amount, 1)));
    });

    it('should display participant\'s balance rounded to one decimal', function() {
        const label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.textContent).to.equal('' + (NumberUtils.round(shareModel.balance, 1)));
    });

    it('should add class "negative" to balance label if participant\'s balance is negative', function() {
        const label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.className.indexOf('negative')).not.to.equal(-1);
    });

    it('should add class "positive" to balance label if participant\'s balance is positive', function() {
        // update share model and re-render with updated model
        shareModel.balance = 50;
        renderItem(shareModel);

        const label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.className.indexOf('positive')).not.to.equal(-1);
    });

    it('should not add classes to balance label if participant\'s balance is 0', function() {
        // update share model and re-render with updated model
        shareModel.balance = 0;
        renderItem(shareModel);

        const label = TestUtils.findRenderedDOMComponentWithClass(shareListItem, 'share-balance');
        expect(label.className.indexOf('negative')).to.equal(-1);
        expect(label.className.indexOf('positive')).to.equal(-1);
    });
});