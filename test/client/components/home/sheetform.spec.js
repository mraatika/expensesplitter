import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {t} from 'common/dictionary/dictionary';
import pages from 'client/constants/pages';
import {componentRenderer} from '../../support/testhelper';
import proxyquire from 'proxyquire';


describe('Component:SheetForm', () => {

    proxyquire.noCallThru();
    proxyquire.noPreserveCache();

    const navigateSpy = sinon.spy();

    const SheetForm = proxyquire('components/home/sheetform.jsx', {
        'client/router/routerservice': { navigateTo: navigateSpy }
    }).default;

    const defaultProps = {
        saveSheet: sinon.spy(),
        updateSheet: sinon.spy(),
        toggleNewSheetAdded: sinon.spy()
    };

    const renderComponent = componentRenderer(SheetForm, defaultProps);

    afterEach(() => {
        navigateSpy.reset();
        defaultProps.toggleNewSheetAdded.reset();
        defaultProps.saveSheet.reset();
        defaultProps.updateSheet.reset();
    });

    describe('State when there isn\'t current sheet', () => {
        const sheet = { name: 'Camping Trip', settings: {}, lastSavedOn: null };
        let component;

        beforeEach(() => component = renderComponent({sheet}));

        it('should display label for sheet input (text refers to adding a new sheet)', () => {
            const _component = renderComponent({ sheet: {...sheet, name: null }});
            const label = _component.find('[htmlFor="sheet-name"]');
            expect(label).to.contain.text(t('home.name_your_sheet'));
        });

        it('should display empty sheet name input', () => {
            const _component = renderComponent({ sheet: {...sheet, name: null }});
            const input = _component.find('#sheet-name');
            expect(input).not.to.have.value();
        });

        it('should display an enabled sheet name input', () => {
            const input = component.find('#sheet-name');
            expect(input).not.to.be.disabled();
        });

        it('should find an add button and it should be enabled', () => {
            const button = component.find('button[type="submit"]');
            expect(button).to.contain.text(t('home.button.add'));
            expect(button).not.to.be.disabled();
        });

        it('should find a settings button and it should be enabled', () => {
            const button = component.find('.settings-button');
            expect(button).not.to.be.disabled();
        });

        it('should show the settings section', () => {
            const _component = renderComponent({sheet, dirty: true });
            expect(_component.state('isSettingsActive')).to.be.ok;
        });
    });

    describe('State when current sheet is defined', () => {
        const sheet = { name: 'Camping Trip', settings: {}, lastSavedOn: new Date().toUTCString() };
        let component;

        beforeEach(() => {
            component = renderComponent({sheet});
        });

        it('should display label for sheet input (text refers to editing current sheet)', () => {
            const label = component.find('[htmlFor="sheet-name"]');
            expect(label).to.contain.text(t('lang.current_sheet'));
        });

        it('should display disabled sheet name input with current sheet\'s name', () => {
            const input = component.find('#sheet-name');
            expect(input).to.have.value(sheet.name);
            expect(input).to.be.disabled();
        });

        it('should display edit and continue button enabled', () => {
            const button = component.find('button[type="submit"]');
            expect(button).not.to.be.disabled();
        });

        it('should find a settings button and it should be enabled', () => {
            const button = component.find('.settings-button');
            expect(button).not.to.be.disabled();
        });

        it('should display settings section hidden', () => {
            const _component = renderComponent({sheet, dirty:false });
            expect(_component.state('isSettingsActive')).not.to.be.ok;
        });
    });

    describe('Creating a new sheet', function () {
        const sheet = { id: '1', name: '', settings: {}, lastSavedOn: null, adminKey: 'abc' };
        let component;

        beforeEach(() => component = renderComponent({sheet}));

        it('should call update sheet when name changes', function () {
            const input = component.find('#sheet-name');
            const name = 'TestSheet';
            input.simulate('change', { target: { value: name }});
            expect(defaultProps.updateSheet).to.have.been.calledWithExactly(sheet, { name });
        });

        it('should call saveSheet method when continue button is pressed', () => {
            component.simulate('submit', { preventDefault: new Function() });
            expect(defaultProps.saveSheet).to.have.been.calledWith(sheet);
        });

        it('should navigate to home with admin key in url', function () {
            component.simulate('submit', { preventDefault: new Function() });
            expect(navigateSpy).to.have.been.calledWithExactly(pages.HOME.href, sheet.id, sheet.adminKey);
        });

        it('should toggle new sheet added message', function () {
            component.simulate('submit', { preventDefault: new Function() });
            expect(defaultProps.toggleNewSheetAdded).to.have.been.called;
        });
    });

    describe('Updating a sheet', function () {
        const sheet = { id: '1', name: '', settings: {}, lastSavedOn: new Date(), adminKey: 'abc' };
        let component;

        beforeEach(() => component = renderComponent({sheet}));

        it('should call saveSheet method when continue button is pressed', () => {
            component.simulate('submit', { preventDefault: new Function() });
            expect(defaultProps.saveSheet).to.have.been.calledWith(sheet);
        });

        it('should navigate to participants page', function () {
            component.simulate('submit', { preventDefault: new Function() });
            expect(navigateSpy).to.have.been.calledWithExactly(pages.PARTICIPANTS.href, sheet.id, undefined);
        });

        it('should not toggle new sheet added message', function () {
            component.simulate('submit', { preventDefault: new Function() });
            expect(defaultProps.toggleNewSheetAdded).not.to.have.been.called;
        });

        it('should navigate to participants page with admin key when found in props', function () {
            const _component = renderComponent({sheet, adminKey: sheet.adminKey });
            _component.simulate('submit', { preventDefault: new Function() });
            expect(navigateSpy).to.have.been.calledWithExactly(pages.PARTICIPANTS.href, sheet.id, sheet.adminKey);
        });
    });

    describe('Moving to summary page', function () {
        const sheet = { id: '1', name: '', settings: {}, lastSavedOn: new Date(), adminKey: 'abc' };
        let component;

        beforeEach(() => component = renderComponent({sheet}));

        it('should save the current sheet', function () {
            component.find('#sheet-summary-link').simulate('click');
            expect(defaultProps.saveSheet).to.have.been.calledWith(sheet);
        });

        it('should navigate to summary page', function () {
            component.find('#sheet-summary-link').simulate('click');
            expect(navigateSpy).to.have.been.calledWithExactly(pages.SUMMARY.href, sheet.id, undefined);
        });

        it('should navigate to summary page with admin key when found in props', function () {
            const _component = renderComponent({sheet, adminKey: sheet.adminKey });
            _component.find('#sheet-summary-link').simulate('click');
            expect(navigateSpy).to.have.been.calledWithExactly(pages.SUMMARY.href, sheet.id, sheet.adminKey);
        });
    });
});