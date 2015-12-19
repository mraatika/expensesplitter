import sinon from 'sinon';
import {expect} from 'chai';
import Constants from '../../src/js/constants/AppConstants';
import AppDispatcher from '../../src/js/dispatchers/appdispatcher.js';
import SheetFactory from '../../src/js/factory/sheetfactory.js';
import validation from '../../src/js/validation/validation.js';

describe('SheetStore', function() {
    var SheetStore;

    before(function() {
        sinon.stub(AppDispatcher, 'register');
        SheetStore = require('../../src/js/stores/sheetstore.js').default;
    });

    beforeEach(() => {
        sinon.stub(SheetFactory, 'create');
        sinon.stub(validation, 'validate').returns({});
    });

    afterEach(() => {
        SheetFactory.create.restore();
        validation.validate.restore();
    });

    const getDispatchIndex = () => {
        return AppDispatcher.register.getCall(AppDispatcher.register.callCount -1).args[0];
    };

    const createPayload = (sheet) => {
        return {
            action: {
                type: Constants.ActionTypes.CREATE_SHEET,
                sheet: sheet
            }
        };
    };

    it('should be defined', function () {
        expect(SheetStore).not.to.be.undefined;
    });

    it('should register a callback with the dispatcher', function () {
        expect(AppDispatcher.register.called).to.be.ok;
    });

    describe('ACTIONS', function () {

        describe('Create sheet', function () {
            var sheetName = 'Sheet1';

            var sheet = {
                id: '1',
                name: sheetName
            };

            beforeEach(() => {
                SheetFactory.create.returns(sheet);
            });

            it('should create a new sheet with given name', function () {
                getDispatchIndex()(createPayload({ name: sheetName }));
                var sheets = SheetStore.getSheets();
                expect(sheets.length).not.to.equal(0);
                expect(sheets[0]).to.equal(sheet);
            });

            it('should emit a change event when adding succeeds', function () {
                var spy = sinon.spy();

                SheetStore.addChangeListener(spy);

                getDispatchIndex()(createPayload({ name: sheetName }));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });

            it('should set current sheet id when adding succeeds', function () {
                getDispatchIndex()(createPayload());
                expect(SheetStore.getCurrentSheet().id).to.equal('1');
            });

            it('should emit an error when adding fails', function () {
                validation.validate.returns({ name: true });
                var spy = sinon.spy();

                SheetStore.addChangeListener(spy);
                getDispatchIndex()(createPayload({ name: null }));

                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_SHEET)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });

            it('should not set current sheet id when adding fails', function () {
                SheetFactory.create.returns({ id: '3' });
                validation.validate.returns({ name: true });
                getDispatchIndex()(createPayload());
                expect(SheetStore.getCurrentSheet().id).not.to.equal('3');
            });
        });

        describe('Remove sheet', function () {
            const removePayload = (sheet) => {
                return {
                    action: {
                        type: Constants.ActionTypes.REMOVE_SHEET,
                        sheet: sheet
                    }
                };
            };

            const sheets = [{ id: '1'},{ id: '2'},{ id: '3'}];

            beforeEach(() => {
                sheets.forEach((sheet) => {
                    SheetFactory.create.returns(sheet);
                    getDispatchIndex()(createPayload());
                });
            });

            it('should remove sheet with given id', function () {
                expect(SheetStore.getSheets().length).to.equal(3);
                getDispatchIndex()(removePayload(sheets[0]));
                expect(SheetStore.getSheets().length).to.equal(2);
                expect(SheetStore.getSheet(sheets[0].id)).to.equal.undefined;
            });

            it('should emit a remove event when removal succeeds', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                getDispatchIndex()(removePayload(sheets[0]));

                expect(spy.calledWith(Constants.EventTypes.REMOVE_SHEET_EVENT)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });

            it('should not emit a remove event if sheet is not found', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                getDispatchIndex()(removePayload(sheets[0]));
                getDispatchIndex()(removePayload(sheets[0]));

                expect(spy.callCount).to.equal(1);

                SheetStore.removeChangeListener(spy);
            });

            it('should clear current sheet if removing the current sheet', function () {
                const currentSheet = SheetStore.getCurrentSheet();
                getDispatchIndex()(removePayload(currentSheet));
                expect(SheetStore.getCurrentSheet()).to.be.undefined;
            });
        });

        describe('Change active sheet', function () {
            const sheets = [{ id: '1', name: 'Sheet1'}, { id: '2', name: 'Sheet2' }];
            const setActiveSheetPayload = (sheet) => {
                return {
                    action: {
                        type: Constants.ActionTypes.SET_ACTIVE_SHEET,
                        sheetId: sheet.id
                    }
                };
            };

            beforeEach(() => {
                sheets.forEach((sheet) => {
                    SheetFactory.create.returns(sheet);
                    getDispatchIndex()(createPayload());
                });
                getDispatchIndex()(createPayload());
            });

            it('should set the current sheet', function () {
                getDispatchIndex()(setActiveSheetPayload(sheets[0]));
                expect(SheetStore.getCurrentSheet().name).to.equal(sheets[0].name);
            });

            it('should emit a set active sheet event when succesfully changed the active sheet', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                getDispatchIndex()(setActiveSheetPayload(sheets[0]));

                expect(spy.calledWith(Constants.EventTypes.SET_ACTIVE_SHEET_EVENT)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });

            it('should not emit the change event when the sheet is already active', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                getDispatchIndex()(setActiveSheetPayload(sheets[0]));
                getDispatchIndex()(setActiveSheetPayload(sheets[0]));

                expect(spy.callCount).to.equal(1);

                SheetStore.removeChangeListener(spy);
            });
        });
    });

    describe('EVENTS', function () {

        describe('Save sheet success event', function () {
            const sheet = { id: '1', _isNew: true };
            const saveSheetSuccessPayload = () => {
                return {
                    action: {
                        type: Constants.EventTypes.SAVE_SHEET_SUCCESS,
                        sheetId: sheet.id
                    }
                };
            };

            beforeEach(() => {
                SheetFactory.create.returns(sheet);
                getDispatchIndex()(createPayload(sheet));
            });

            it('should remove _isNew property from the saved sheet', function () {
                expect(SheetStore.getSheet('1')._isNew).to.be.ok;
                getDispatchIndex()(saveSheetSuccessPayload(sheet));
                expect(SheetStore.getSheet('1')._isNew).not.to.be.ok;
            });

            it('should emit a save sheet success event', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                getDispatchIndex()(saveSheetSuccessPayload(sheet));

                expect(spy.calledWith(Constants.EventTypes.SAVE_SHEET_SUCCESS)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });
        });

        describe('Load sheet success event', function () {
            const sheet = { id: '132' };
            const loadSheetSuccessPayload = () => {
                return {
                    action: {
                        type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
                        sheet: sheet
                    }
                };
            };

            beforeEach(() => {
                SheetFactory.create.returns(sheet);
                sinon.stub(AppDispatcher, 'waitFor').returns(true);
            });

            afterEach(() => {
                AppDispatcher.waitFor.restore();
            });

            it('should add the sheet to the store', function () {
                expect(SheetStore.getSheet(sheet.id)).to.be.undefined;
                getDispatchIndex()(loadSheetSuccessPayload(sheet));
                expect(SheetStore.getSheet(sheet.id)).to.equal(sheet);
            });

            it('should emit a change event', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                getDispatchIndex()(loadSheetSuccessPayload(sheet));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });

            it('should emit an add error event when adding fails', function () {
                const spy = sinon.spy();
                SheetStore.addChangeListener(spy);

                validation.validate.returns({ name: true });

                getDispatchIndex()(loadSheetSuccessPayload(sheet));

                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_SHEET)).to.be.ok;

                SheetStore.removeChangeListener(spy);
            });
        });
    });

    describe('ERRORS', function () {
        describe('Remove sheet error', function () {
            const sheet = { id: '142' };
            const removeSheetErrorPayload = () => {
                return {
                    action: {
                        type: Constants.ErrorEventTypes.REMOVE_SHEET,
                        sheet: sheet
                    }
                };
            };
            it('should restore the removed sheet when remove fails (in the server)', function () {
                expect(SheetStore.getSheet(sheet.id)).to.be.undefined;
                getDispatchIndex()(removeSheetErrorPayload());
                expect(SheetStore.getSheet(sheet.id)).not.to.be.undefined;
            });
        });
    });
});