import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import Constants from 'client/constants/appconstants';

describe('Reducer:SheetHistoryReducer', function () {

    const storageSetAllSpy = sinon.spy();
    const storageGetAllStub = sinon.stub();
    const storageClearStub = sinon.stub();
    let reducer;

    // block call to the actual implementation
    proxyquire.noCallThru();
    // do not cache mocked modules (affects other tests)
    proxyquire.noPreserveCache();

    before(() => reducer = proxyquire('client/stores/sheethistoryreducer', {
        'client/factory/storagefactory': () => { return { setAll: storageSetAllSpy, getAll: storageGetAllStub, clear: storageClearStub };}
    }).sheetHistoryReducer);

    afterEach(() => {
        storageSetAllSpy.reset();
        storageGetAllStub.reset().returns({});
    });

    describe('Initial state', function () {
        it('should return initial state from storage', function () {
            const savedState = { '123': {}};
            storageGetAllStub.returns(savedState);
            expect(reducer(undefined, {})).to.deep.equal(savedState);
        });
    });

    describe('Adding sheet history entry', function () {
        const sheet = { id: '123', name: 'testsheet', createdOn: new Date()};
        const saveSheetEvent = { type: Constants.EventTypes.SAVE_SHEET_SUCCESS, payload: { data: { sheet }}};
        const loadSheetEvent = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should add an entry with id', function () {
            const res = reducer({}, saveSheetEvent);
            expect(res[sheet.id]).not.to.be.undefined;
            expect(res[sheet.id].id).to.equal(sheet.id);
        });

        it('should add an entry with sheet name', function () {
            expect(reducer({}, saveSheetEvent)[sheet.id].name).to.equal(sheet.name);
        });

        it('should add an entry with creation date', function () {
            expect(reducer({}, saveSheetEvent)[sheet.id].createdOn).to.equal(sheet.createdOn);
        });

        it('should extend current state', function () {
            const initialState = { '345': {} };
            const res = reducer(initialState, saveSheetEvent);

            expect(res['345']).to.be.defined;
            expect(res[sheet.id]).to.be.defined;
        });

        it('should return a new object', function () {
            const initialState = { '345': {} };
            // should not same object as the initial state object
            expect(reducer(initialState, saveSheetEvent)).not.to.equal(initialState);
        });

        it('should save changes to the storage', function () {
            reducer({}, saveSheetEvent);
            expect(storageSetAllSpy).to.have.been.calledWithExactly({ [sheet.id]:sheet });
        });

        it('should add new entry when load succeeded', function () {
            const res = reducer({}, loadSheetEvent);
            expect(res[sheet.id]).not.to.be.undefined;
        });
    });

    describe('Removing sheet history entry after a sheet is successfully removed', function () {
        const id = '123';
        const removeSheetEvent = { type: Constants.EventTypes.REMOVE_SHEET_SUCCESS, payload: { data: { id }}};

        it('should remove corresponding entry', function () {
            const res = reducer({ [id]: {}, '234': {}}, removeSheetEvent);
            expect(res[id]).to.be.undefined;
            expect(res['234']).to.be.defined;
        });

        it('should save changes to the storage', function () {
            const initialState = { [id]: {}, '234': {}};
            reducer(initialState, removeSheetEvent);
            expect(storageSetAllSpy).to.have.been.calledWithExactly({ '234': {} });
        });

        it('should return a new object', function () {
            const initialState = { [id]: {}, '234': {} };
            // should not same object as the initial state object
            expect(reducer(initialState, removeSheetEvent)).not.to.equal(initialState);
        });
    });

    describe('Removing a sheet history entry after a REMOVE_SHEET_HISTORY_ENTRY action', function () {
        const id = '123';
        const removeSheetHistoryAction = { type: Constants.ActionTypes.REMOVE_SHEET_HISTORY_ENTRY, entry: { id }};

        it('should remove corresponding entry', function () {
            const res = reducer({ [id]: {}, '234': {}}, removeSheetHistoryAction);
            expect(res[id]).to.be.undefined;
            expect(res['234']).to.be.defined;
        });

        it('should save changes to the storage', function () {
            const initialState = { [id]: {}, '234': {}};
            reducer(initialState, removeSheetHistoryAction);
            expect(storageSetAllSpy).to.have.been.calledWithExactly({ '234': {} });
        });

        it('should return a new object', function () {
            const initialState = { [id]: {}, '234': {} };
            // should not same object as the initial state object
            expect(reducer(initialState, removeSheetHistoryAction)).not.to.equal(initialState);
        });
    });

    describe('Removing all history entries', function () {
        const id = '123';
        const removeAllHistoryAction = { type: Constants.ActionTypes.CLEAR_HISTORY };

        it('should remove corresponding entry', function () {
            const res = reducer({ [id]: {}, '234': {}}, removeAllHistoryAction);
            expect(res[id]).to.be.undefined;
            expect(res['234']).to.be.undefined;
        });

        it('should clear the storage', function () {
            const initialState = { [id]: {}, '234': {}};
            reducer(initialState, removeAllHistoryAction);
            expect(storageClearStub).to.have.been.called;
        });

        it('should return a new object', function () {
            const initialState = {};
            // should not same object as the initial state object
            expect(reducer(initialState, removeAllHistoryAction)).not.to.equal(initialState);
        });
    });
});