import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {t} from '../../../src/js/dictionary/dictionary.js';

describe('Component:HomePage', function() {
    const jsdom = require('mocha-jsdom');
    const SheetStoreMock = {
        addChangeListener: sinon.spy(),
        removeChangeListener: sinon.spy(),
        getSheets: sinon.stub(),
        getSheet: sinon.stub()
    };
    const DataActionCreatorsMock = {
        removeSheet: sinon.spy()
    };

    let React;
    let TestUtils;
    let HomePage;
    let LoadSheetDialog;
    let homePage;

    const renderComponent = (sheet) => {
        SheetStoreMock.getSheet.returns(sheet);
        SheetStoreMock.getSheets.returns(sheet ? [sheet] : []);
        homePage = TestUtils.renderIntoDocument(<HomePage currentSheetId={(sheet || {}).id}/>);
    };

    proxyquire.noCallThru();
    jsdom();

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        HomePage = proxyquire('../../../src/js/components/home/homepage.jsx', {
            '../../stores/sheetstore.js': SheetStoreMock,
            '../../actions/dataactioncreators': DataActionCreatorsMock,
            '../../router/router.js': { navigateToSheetURL: sinon.spy(), navigateTo: sinon.spy() }
        }).default;
        LoadSheetDialog = require('../../../src/js/components/home/loadsheetdialog.jsx').default;
    });

    describe('State when current sheet is not defined', function () {
        beforeEach(() => renderComponent());

        it('should display add button disabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');
            expect(button.disabled).to.equal(true);
        });

        it('should display remove button disabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            expect(button.disabled).to.equal(true);
        });

        it('should display load button enabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-load-sheet');
            expect(button.disabled).to.equal(false);
        });
    });

    describe('State when current sheet is defined', function () {
        var sheet = { name: 'Camping Trip', settings: {} };

        beforeEach(() => renderComponent(sheet));

        it('should display add button enabled', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');
            expect(button.disabled).to.equal(false);
        });

        it('should display remove button enabled', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            expect(button.disabled).to.equal(false);
        });

        it('should load button enabled', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-load-sheet');
            expect(button.disabled).to.equal(false);
        });
    });

    describe('Removing current sheet', function () {
        var sheet = { id: '1', name: 'Camping Trip', settings: {} };

        beforeEach(() => renderComponent(sheet));

        it('should display a confirmation dialog for remove action', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            var dialog = homePage.refs.removeSheetConfirmationDialog;
            var modal = dialog._modal;

            expect(modal.state.showModal).to.equal(false);

            TestUtils.Simulate.click(button);

            expect(modal.state.showModal).to.equal(true);

            expect(DataActionCreatorsMock.removeSheet.called).not.to.be.ok;
        });
    });

    describe('Loading a sheet', function () {
        beforeEach(() => renderComponent());

        it('should open the load sheet dialog when load button is pressed', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-load-sheet');
            var dialog = TestUtils.findRenderedComponentWithType(homePage, LoadSheetDialog);
            var modal = dialog._dialog;

            expect(modal.state.showModal).to.equal(false);

            TestUtils.Simulate.click(button);

            expect(modal.state.showModal).to.equal(true);
        });
    });
});