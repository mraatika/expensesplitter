import sinon from 'sinon';
import {expect} from 'chai';
import getStubs from '../support/stubs.js';
import Constants from '../../src/js/constants/AppConstants';

const proxyquire = require('proxyquire').noCallThru();

describe('SheetHistoryStore', function () {
    const stubs = getStubs();
    const sheetStoreStub = {
        getSheet: sinon.stub()
    };
    const sheet = { id: '1', name: 'Sheet1', createdOn: new Date() };

    let SheetHistoryStore;
    let dispatch;

    const createPayload = (sheet) => {
        return {
            action: {
                type: Constants.EventTypes.SAVE_SHEET_SUCCESS,
                sheetId: sheet.id
            }
        };
    };

    const removePayload = (sheet) => {
        return {
            action: {
                type: Constants.EventTypes.REMOVE_SHEET_SUCCESS,
                sheet: sheet
            }
        };
    };

    const loadPayload = (sheet) => {
        return {
            action: {
                type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
                sheet: sheet
            }
        };
    };

    const removeAllPayload = () => {
        return {
            action: {
                type: Constants.ActionTypes.CLEAR_HISTORY
            }
        };
    };

    before(() => {
        stubs.factory.create.withArgs(Constants.SHEET_STORE_NAME).returns(stubs.storage);

        SheetHistoryStore = proxyquire('../../src/js/stores/sheethistorystore.js', {
            '../factory/storagefactory': stubs.factory,
            '../dispatchers/appdispatcher': stubs.dispatcher,
            '../factory/sheethistoryfactory': stubs.factory,
            './sheetstore': sheetStoreStub
        }).default;

        dispatch = stubs.dispatcher.register.getCall(0).args[0];
    });

    beforeEach(() => {
        stubs.factory.create.withArgs(sheet).returns(sheet);
        sheetStoreStub.getSheet.returns(sheet);
    });

    afterEach(() => {
        SheetHistoryStore.removeAllListeners();
        stubs.sandbox.reset();
    });

    describe('Public API', function () {
        it('should register a callback with the dispatcher', () => {
            expect(stubs.dispatcher.register.called).to.be.ok;
        });

        it('should expose getSheets function that returns all from storage', () => {
            expect(SheetHistoryStore.getHistory).not.to.be.undefined;
            SheetHistoryStore.getHistory();
            expect(stubs.storage.getAll.called).to.be.ok;
        });
    });

    describe('ACTIONS', function () {

        describe('Saving a history marking', function () {

            it('should add history model to the store', function () {
                dispatch(createPayload(sheet));
                expect(stubs.storage.set.calledWith(sheet.id)).to.be.ok;
            });

            it('should not add same history model twice', function () {
                stubs.storage.get.withArgs(sheet.id).returns(sheet);
                dispatch(createPayload(sheet));
                expect(stubs.storage.set.calledWith(sheet.id)).not.to.be.ok;
            });

            it('should fire a change event after marking is created', function () {
                const spy = sinon.spy();
                SheetHistoryStore.addChangeListener(spy);

                dispatch(createPayload(sheet));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

        });

        describe('Saving a history marking after load event', function () {

            it('should add a history marking when sheet is loaded', function () {
                stubs.storage.get.withArgs(sheet.id).returns(undefined);
                dispatch(loadPayload(sheet));
                expect(stubs.storage.set.calledWith(sheet.id)).to.be.ok;
            });

            it('should fire a change event after marking is created', function () {
                stubs.storage.get.withArgs(sheet.id).returns(undefined);

                const spy = sinon.spy();
                SheetHistoryStore.addChangeListener(spy);

                dispatch(loadPayload(sheet));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });
        });

        describe('Removing a history marking', function () {

            beforeEach(() => {
                stubs.storage.get.withArgs(sheet.id).returns(sheet);
            });

            describe('Removing a single expense', function () {
                it('should remove a participant with id', function () {
                    dispatch(removePayload(sheet));
                    expect(stubs.storage.remove.calledWith(sheet.id)).to.be.ok;
                });

                it('should not call storage.remove if the sheet is not found', function () {
                    stubs.storage.get.withArgs(sheet.id).returns(undefined);
                    dispatch(removePayload(sheet));
                    expect(stubs.storage.remove.calledWith(sheet.id)).not.to.be.ok;
                });

                it('should fire a change event after marking is removed', function () {
                    const spy = sinon.spy();
                    SheetHistoryStore.addChangeListener(spy);

                    dispatch(removePayload(sheet));

                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });
            });

            describe('Clearing the history', function () {

                it('should remove all the history markings from the storage', function () {
                    dispatch(removeAllPayload());
                    expect(stubs.storage.clear.called).to.be.ok;
                });

                it('should emit a change event after removal', function () {
                    const spy = sinon.spy();
                    SheetHistoryStore.addChangeListener(spy);
                    dispatch(removeAllPayload());
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });
            });
        });
    });
});