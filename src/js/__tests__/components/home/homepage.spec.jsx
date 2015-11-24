jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-testutils-additions';

const HomePage = require('../../../components/home/homepage.jsx').default;
const ActionCreators = require('../../../actions/dataactioncreators.js').default;
const dictionary = require('../../../dictionary/dictionary.js');
const DataStore = require('../../../stores/datastore').default;
const LoadSheetDialog = require('../../../components/home/loadsheetdialog.jsx').default;

describe('Component:HomePage', function() {
    var homePage;

    var currentSheetId = '1';
    var storageMock = {
        get: jest.genMockFunction(),
        getAll: jest.genMockFunction(),
        set: jest.genMockFunction(),
        remove: jest.genMockFunction()
    };

    var renderComponent = function(sheet) {
        storageMock.get.mockImplementation(function(key) {
            if (key === 'currentSheetId') return currentSheetId;
            return sheet || null;
        });
        DataStore.init(storageMock);
        homePage = TestUtils.renderIntoDocument(<HomePage/>);
    };

    afterEach(function() {
        DataStore.removeAllListeners();
    });

    describe('State when no sheets are created', function() {

        beforeEach(function() {
            renderComponent();
        });

        it('should display label for sheet input (text refers to adding a new sheet)', function () {
            var label = TestUtils.findRenderedDOMComponentWithTag(homePage, 'label');
            expect(label.textContent).toEqual(dictionary.t('home.name_your_sheet') + ':');
        });

        it('should display empty sheet name input', function() {
            var input = TestUtils.findRenderedDOMComponentWithTag(homePage, 'input');
            expect(input.value).toBeFalsy();
            expect(homePage.state.currentSheet).toBeFalsy();
            expect(homePage.state.currentSheetName).toBeFalsy();
        });

        it('should find an add and continue button', function () {
            var button = TestUtils.findRenderedDOMComponentWithAttributeValue(homePage, 'type', 'submit');
            expect(button.disabled).toEqual(false);
        });

        it('should enable add and continue button when current sheet name field is filled', function () {
            var input = TestUtils.findRenderedDOMComponentWithTag(homePage, 'input');
            TestUtils.Simulate.change(input, { target: { value: 'Trip to Cancun' }});
            expect(input.disabled).toEqual(false);
        });

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

        it('should call addSheet method when continue button is pressed', function () {
            var form = TestUtils.findRenderedDOMComponentWithTag(homePage, 'form');

            spyOn(homePage, '_addSheet').andCallThrough();
            spyOn(ActionCreators, 'addSheet');

            // set currentSheetName to enable the add button
            homePage.setState({ currentSheetName: 'Trip to Cancun' });

            TestUtils.Simulate.submit(form);

            expect(homePage._addSheet).toHaveBeenCalled();
            expect(ActionCreators.addSheet).toHaveBeenCalledWith(homePage.state.currentSheetName);
        });
    });

    describe('State when current sheet is defined', function () {
        var sheet = { name: 'Camping Trip' };

        beforeEach(function() {
            renderComponent(sheet);
        });

        it('should display label for sheet input (text refers to editing current sheet)', function () {
            var label = TestUtils.findRenderedDOMComponentWithTag(homePage, 'label');
            expect(label.textContent).toEqual(dictionary.t('lang.current_sheet') + ':');
        });

        it('should display disabled sheet name input with current sheet\'s name', function() {
            var input = TestUtils.findRenderedDOMComponentWithTag(homePage, 'input');
            expect(input.value).toEqual(sheet.name);
            expect(homePage.state.currentSheet).toEqual(sheet);
            expect(homePage.state.currentSheetName).toEqual(sheet.name);
            expect(input.disabled).toEqual(true);
        });

        it('should display edit and continue button enabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithAttributeValue(homePage, 'type', 'submit');
            expect(button.disabled).toEqual(false);
        });

        it('should display add button disabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-add-sheet');
            expect(button.disabled).toEqual(false);
        });

        it('should display remove button disabled', function () {
            // this is a test itself b/c it throws if the element isn't found
            var button = TestUtils.findRenderedDOMComponentWithId(homePage, 'button-remove-sheet');
            expect(button.disabled).toEqual(false);
        });

        it('should call editCurrentSheetAndContinue method when continue button is pressed', function () {
            var form = TestUtils.findRenderedDOMComponentWithTag(homePage, 'form');

            spyOn(homePage, '_editCurrentSheetAndContinue');
            TestUtils.Simulate.submit(form);

            expect(homePage._editCurrentSheetAndContinue).toHaveBeenCalled();
        });
    });

    describe('Removing current sheet', function () {
        var sheet = { id: '1', name: 'Camping Trip' };

        beforeEach(function() {
            renderComponent(sheet);
        });

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

            expect(ActionCreators.removeSheet).toHaveBeenCalledWith(sheet.id);
        });
    });

    describe('Adding new sheet when current sheet is present', function () {
        var sheet = { id: '2', name: 'Camping Trip'};

        beforeEach(function() {
            renderComponent(sheet);
        });

        it('should clear current sheet name from input', function () {
            var input = TestUtils.findRenderedDOMComponentWithTag(homePage, 'input');
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