import {expect} from 'chai';
import sinon from 'sinon';
import {t} from '../../../../src/common/dictionary/dictionary';
import proxyquire from 'proxyquire';

describe('SheetForm', () => {
    const jsdom = require('mocha-jsdom');

    let React;
    let TestUtils;
    let SheetForm;
    let ActionCreators;
    let sheetForm;

    const renderComponent = (sheet) => {
        sheetForm = TestUtils.renderIntoDocument(<SheetForm currentSheet={sheet}/>);
    };

    proxyquire.noCallThru();
    jsdom();

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        SheetForm = proxyquire('components/home/sheetform.jsx', {
            '../../router/router.js': { navigateToSheetURL: sinon.spy() }
        }).default;

        ActionCreators = require('actions/dataactioncreators.js').default;
    });

    describe('State when there isn\'t current sheet', () => {

        beforeEach(() => renderComponent());

        it('should display label for sheet input (text refers to adding a new sheet)', () => {
            const label = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'for', 'sheet-name');
            expect(label.textContent.indexOf(t('home.name_your_sheet'))).not.to.equal(-1);
        });

        it('should display empty sheet name input', () => {
            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            expect(input.value).not.to.be.ok;
            expect(sheetForm.state.currentSheetName).not.to.be.ok;
        });

        it('should display an enabled sheet name input', () => {
            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            expect(input.disabled).to.equal(false);
        });

        it('should find an add button and it should be enabled', () => {
            const button = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'type', 'submit');
            expect(button.textContent.indexOf(t('home.button.add'))).not.to.equal(-1);
            expect(button.disabled).to.equal(false);
        });

        it('should find a settings button and it should be enabled', () => {
            const button = TestUtils.findRenderedDOMComponentWithClass(sheetForm, 'settings-button');
            expect(button.disabled).not.to.be.ok;
        });

        it('should call createSheet method when continue button is pressed', () => {
            const sheetName = 'Trip to Cancun';
            const form = TestUtils.findRenderedDOMComponentWithTag(sheetForm, 'form');

            sinon.spy(ActionCreators, 'createSheet');

            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            input.value = sheetName;

            TestUtils.Simulate.change(input);

            TestUtils.Simulate.submit(form);

            expect(ActionCreators.createSheet.called).to.be.ok;
        });

        it('should show the settings section', () => {
            expect(sheetForm.state.isSettingsActive).to.be.ok;
        });
    });

    describe('State when current sheet is defined', () => {
        const sheet = { name: 'Camping Trip', settings: {} };

        beforeEach(() => {
            renderComponent(sheet);
        });

        it('should display label for sheet input (text refers to editing current sheet)', () => {
            const label = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'for', 'sheet-name');
            expect(label.textContent.indexOf(t('lang.current_sheet'))).not.to.equal(-1);
        });

        it('should display disabled sheet name input with current sheet\'s name', () => {
            const input = TestUtils.findRenderedDOMComponentWithId(sheetForm, 'sheet-name');
            expect(input.value).to.equal(sheet.name);
            expect(input.disabled).to.equal(true);
        });

        it('should display edit and continue button enabled', () => {
            const button = TestUtils.findRenderedDOMComponentWithAttributeValue(sheetForm, 'type', 'submit');
            expect(button.disabled).to.equal(false);
        });

        it('should find a settings button and it should be enabled', () => {
            const button = TestUtils.findRenderedDOMComponentWithClass(sheetForm, 'settings-button');
            expect(button.disabled).to.equal(false);
        });

        it('should display settings section hidden', () => {
            expect(sheetForm.state.isSettingsActive).not.to.be.ok;
        });
    });
});