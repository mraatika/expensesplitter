jest.dontMock('../../../components/home/homepage.jsx');
jest.dontMock('../../../dictionary/dictionary.js');
jest.dontMock('../../../constants/pages.js');

import React from 'react';
import TestUtils from 'react-testutils-additions';
import sinon from 'sinon';

const HomePage = require('../../../components/home/homepage.jsx').default;
const DataStore = require('../../../stores/sheetstore.js').default;
const ActionCreators = require('../../../actions/dataactioncreators.js').default;
const dictionary = require('../../../dictionary/dictionary.js');
const LoadSheetDialog = require('../../../components/home/loadsheetdialog.jsx').default;

describe('Component:HomePage', function() {
    let homePage;

    const renderComponent = (sheet) => {
        sinon.stub(DataStore, 'getCurrentSheet').returns(sheet);
        sinon.stub(DataStore, 'getSheets').returns(sheet ? [sheet] : []);
        homePage = TestUtils.renderIntoDocument(<HomePage/>);
    };

    afterEach(() => {
        DataStore.getCurrentSheet.restore();
        DataStore.getSheets.restore();
        DataStore.removeAllListeners();
    });

    describe('State when current sheet is not defined', function () {
        beforeEach(() => renderComponent());

        it('should display add button disabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');
            expect(button.disabled).toEqual(true);
        });

        it('should display remove button disabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            expect(button.disabled).toEqual(true);
        });

        it('should display load button enabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-load-sheet');
            expect(button.disabled).toEqual(false);
        });
    });

    describe('State when current sheet is defined', function () {
        var sheet = { name: 'Camping Trip', settings: {} };

        beforeEach(() => renderComponent(sheet));

        it('should display add button enabled', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');
            expect(button.disabled).toEqual(false);
        });

        it('should display remove button enabled', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            expect(button.disabled).toEqual(false);
        });

        it('should load button enabled', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-load-sheet');
            expect(button.disabled).toEqual(false);
        });
    });

    describe('Removing current sheet', function () {
        var sheet = { id: '1', name: 'Camping Trip', settings: {} };

        beforeEach(() => renderComponent(sheet));

        it('should display a confirmation dialog for remove action', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            var dialog = homePage.refs.removeSheetConfirmationDialog;
            var modal = dialog._modal;

            spyOn(ActionCreators, 'removeSheet');

            expect(modal.state.showModal).toEqual(false);

            TestUtils.Simulate.click(button);

            expect(modal.state.showModal).toEqual(true);

            expect(ActionCreators.removeSheet).not.toHaveBeenCalledWith(sheet.id);
        });

        it('should clear current sheet when remove button is pressed', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            var dialog = homePage.refs.removeSheetConfirmationDialog;
            var modal = dialog._modal;

            spyOn(ActionCreators, 'removeSheet');
            TestUtils.Simulate.click(button);

            modal.props.buttons[0].click();

            expect(modal.state.showModal).toEqual(false);

            expect(ActionCreators.removeSheet).toHaveBeenCalledWith(sheet);
        });
    });

    describe('Adding new sheet when current sheet is present', function () {
        var sheet = { id: '2', name: 'Camping Trip', settings: {}};

        beforeEach(() => renderComponent(sheet));

        it('should clear current sheet name from input', function () {
            var input = TestUtils.findRenderedDOMComponentWithId(homePage, 'sheet-name');
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');

            TestUtils.Simulate.click(button);

            expect(input.value).toBeFalsy();
            expect(homePage.state.currentSheet).toBeFalsy();
            expect(homePage.state.currentSheetName).toBeFalsy();
            expect(input.disabled).toEqual(false);
        });

        it('should display an info text about previous sheet', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');
            var infoText = TestUtils.findRenderedDOMComponentWithClass(homePage, 'message-container');

            expect(infoText.style.display).toEqual('none');

            TestUtils.Simulate.click(button);

            expect(infoText.style.display).toEqual('block');
            expect(infoText.textContent).toEqual(dictionary.t('home.prev_sheet_saved') + ' ' + dictionary.t('home.load_sheet_action') + '.');
        });
    });

    describe('Loading a sheet', function () {
        beforeEach(() => renderComponent());

        it('should open the load sheet dialog when load button is pressed', function () {
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-load-sheet');
            var dialog = TestUtils.findRenderedComponentWithType(homePage, LoadSheetDialog);
            var modal = dialog._dialog;

            expect(modal.state.showModal).toEqual(false);

            TestUtils.Simulate.click(button);

            expect(modal.state.showModal).toEqual(true);
        });
    });
});