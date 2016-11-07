import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {Link} from 'react-router';
import proxyquire from 'proxyquire';
import pages from 'client/constants/pages';
import {componentRenderer} from '../../support/testhelper';

describe('Component:HomePage', function() {

    const defaultProps = {
        saveSheet:sinon.spy(),
        updateSheet:sinon.spy(),
        removeSheet:sinon.spy(),
        toggleLoadSheetDialog:sinon.spy(),
        toggleNewSheetAdded:sinon.spy(),
        params: {}
    };

    const browserHistoryPushSpy = sinon.spy();

    proxyquire.noCallThru();
    proxyquire.noPreserveCache();

    const HomePage = proxyquire('components/home/homepage.jsx', {
        'react-router' : { browserHistory: { push: browserHistoryPushSpy }, Link }
    }).default;

    const renderComponent = componentRenderer(HomePage, defaultProps);

    describe('State when current sheet has not been created by the user', function () {
        const sheet = { id: '1', settings: {} };
        let homePage;

        beforeEach(() => homePage = renderComponent({ sheet }));

        it('should display add button disabled', function () {
            const button = homePage.find('#button-add-sheet');
            expect(button).to.be.disabled();
        });

        it('should display remove button disabled', function () {
            const button = homePage.find('#button-remove-sheet');
            expect(button).to.be.disabled();
        });

        it('should display load button enabled', function () {
            const button = homePage.find('#button-load-sheet');
            expect(button).not.to.be.disabled();
        });
    });

    describe('State when sheet is created and saved by the admin user', function () {
        const sheet = { name: 'Test', settings: {}, lastSavedOn: new Date().toUTCString(), adminKey: '123' };
        let homePage;

        beforeEach(() => homePage = renderComponent({sheet, params: { adminKey: '123' }}));

        it('should display add button enabled', function () {
            const button = homePage.find('#button-add-sheet');
            expect(button).not.to.be.disabled();
        });

        it('should display remove button enabled', function () {
            const button = homePage.find('#button-remove-sheet');
            expect(button).not.to.be.disabled();
        });

        it('should load button enabled', function () {
            const button = homePage.find('#button-load-sheet');
            expect(button).not.to.be.disabled();
        });
    });

    describe('State when sheet is loaded by non admin user', function () {
        it('should display remove button enabled', function () {
            const sheet = { name: 'Test', settings: {}, lastSavedOn: new Date().toUTCString(), adminKey: '123' };
            const homePage = renderComponent({sheet, params: { adminKey: '' }});
            const button = homePage.find('#button-remove-sheet');
            expect(button).to.be.disabled();
        });
    });

    describe('Adding a sheet', function () {
        const sheet = { name: 'Test', settings: {} };
        let button;

        beforeEach(() => {
            const homePage = renderComponent({sheet});
            button = homePage.find('#button-add-sheet');
        });

        it('should call toggleNewSheetAdded', function () {
            button.simulate('click');
            expect(defaultProps.toggleNewSheetAdded).to.have.been.calledWith(true);
        });

        it('should navigate to root', function () {
            button.simulate('click');
            expect(browserHistoryPushSpy).to.have.been.calledWith(pages.HOME.href);
        });
    });

    describe('Loading a sheet', function () {
        it('should call toggleLoadSheetDialog', function () {
            const sheet = { name: 'Test', settings: {} };
            const homePage = renderComponent({sheet});
            const button = homePage.find('#button-load-sheet');

            button.simulate('click', { preventDefault: () => {} });
            expect(defaultProps.toggleLoadSheetDialog).to.have.been.called;
        });
    });
});