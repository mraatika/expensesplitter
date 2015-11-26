jest.dontMock('../../../components/home/sheetform.jsx');
jest.dontMock('../../../dictionary/dictionary.js');

import React from 'react';
import TestUtils from 'react-testutils-additions';

const SheetForm = require('../../../components/home/sheetform.jsx').default;
const t = require('../../../dictionary/dictionary.js').t;
const ActionCreators = require('../../../actions/dataactioncreators.js').default;

describe('SheetForm', function () {
    let sheetForm;

    const renderComponent = (sheet) => {
        sheetForm = TestUtils.renderIntoDocument(<SheetForm currentSheet={sheet}/>);
    };

    describe('State when there isn\'t current sheet', function() {

        beforeEach(() => renderComponent());

        it('should display label for sheet input (text refers to adding a new sheet)', function () {
            const label = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'for', 'sheet-name');
            expect(label.textContent.indexOf(t('home.name_your_sheet'))).not.toEqual(-1);
        });

        it('should display empty sheet name input', function() {
            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            expect(input.value).toBeFalsy();
            expect(sheetForm.state.currentSheetName).toBeFalsy();
        });

        it('should display an enabled sheet name input', function() {
            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            expect(input.disabled).toEqual(false);
        });

        it('should find an add button and it should be enabled', function () {
            const button = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'type', 'submit');
            expect(button.textContent.indexOf(t('home.button.add'))).not.toEqual(-1);
            expect(button.disabled).toEqual(false);
        });

        it('should find a settings button and it should be disabled', function () {
            const button = TestUtils.findRenderedDOMComponentWithClass(sheetForm, 'settings-button');
            expect(button.disabled).toEqual(true);
        });

        it('should not find a settings section', function () {
            expect(() => {
                TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-settings');
            }).toThrow();
        });

        it('should call addSheet method when continue button is pressed', function () {
            const sheetName = 'Trip to Cancun';
            const form = TestUtils.findRenderedDOMComponentWithTag(sheetForm, 'form');

            spyOn(ActionCreators, 'addSheet');

            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            input.value = sheetName;
            TestUtils.Simulate.change(input);

            TestUtils.Simulate.submit(form);

            expect(ActionCreators.addSheet).toHaveBeenCalledWith(sheetName);
        });
    });

    describe('State when current sheet is defined', function () {
        const sheet = { name: 'Camping Trip', settings: {} };

        beforeEach(function() {
            renderComponent(sheet);
        });

        it('should display label for sheet input (text refers to editing current sheet)', function () {
            const label = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'for', 'sheet-name');
            expect(label.textContent.indexOf(t('lang.current_sheet'))).not.toEqual(-1);
        });

        it('should display disabled sheet name input with current sheet\'s name', function() {
            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            expect(input.value).toEqual(sheet.name);
            expect(input.disabled).toEqual(true);
        });

        it('should display edit and continue button enabled', function () {
            const button = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'type', 'submit');
            expect(button.disabled).toEqual(false);
        });

        it('should find a settings button and it should be enabled', function () {
            const button = TestUtils.findRenderedDOMComponentWithClass(sheetForm, 'settings-button');
            expect(button.disabled).toEqual(false);
        });

        it('should find a settings section', function () {
            expect(() => {
                TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-settings');
            }).not.toThrow();
        });
    });
});