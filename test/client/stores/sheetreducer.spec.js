import {expect} from 'chai';
import Constants from 'client/constants/appconstants';
import {sheetReducer as reducer} from 'client/stores/sheetreducer';

describe('Reducer:SheetReducer', function () {

    describe('Initial state', function () {
        it('should have an empty sheet object', function () {
            const res = reducer(undefined, {});
            expect(res.sheet).to.be.an('object');
            expect(res.sheet).to.be.empty;
        });

        it('should have dirty property as false', function () {
            expect(reducer(undefined, {}).dirty).not.to.be.ok;
        });

        it('should return same object when action is not handled', function () {
            const initialState = {};
            expect(reducer(initialState, {})).to.equal(initialState);
        });
    });

    describe('Creating a sheet', function () {
        const sheet = { name: 'testsheet' };
        const action = { type: Constants.ActionTypes.CREATE_SHEET, sheet };

        it('should create new sheet and add it to state', function () {
            const res = reducer({}, action);
            expect(res.sheet.name).to.equal(sheet.name);
            expect(res.sheet.id).to.be.defined;
        });

        it('should mark sheet dirty', function () {
            const res = reducer({}, action);
            expect(res.dirty).to.be.ok;
        });

        it('should not return same object', function () {
            const initialState = { sheet, dirty: true };
            expect(reducer(sheet, action)).not.to.equal(initialState);
        });
    });

    describe('Updating a sheet', function () {
        const initialState = { dirty: false, sheet: { id: '123', name: 'testsheet1' }};
        const update = { id: '123', name: 'testsheet2', prop: 'abc' };
        const action = { type: Constants.ActionTypes.UPDATE_SHEET, update };

        it('should update sheet with given props', function () {
            const {sheet} = reducer(initialState, action);
            expect(sheet.id).to.equal(initialState.sheet.id);
            expect(sheet.name).to.equal(update.name);
            expect(sheet.prop).to.equal(update.prop);
        });

        it('should mark sheet dirty', function () {
            expect(reducer(initialState, action).dirty).to.be.ok;
        });

        it('should not return same object', function () {
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Load sheet success', function () {
        const sheet = { id: '123', name: 'testsheet1' };
        const action = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should set the received sheet to the state', function () {
            expect(reducer({}, action).sheet).to.deep.equal(sheet);
        });

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).not.to.be.ok;
        });

        it('should not return the same object', function () {
            const initialState = { sheet: {}, dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Save sheet success', function () {
        const sheet = { id: '123', name: 'testsheet1' };
        const action = { type: Constants.EventTypes.SAVE_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should set the received sheet to the state', function () {
            expect(reducer({}, action).sheet).to.deep.equal(sheet);
        });

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).not.to.be.ok;
        });

        it('should not return the same object', function () {
            const initialState = { sheet: {}, dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Save sheet error', function () {
        const action = { type: Constants.ErrorEventTypes.SAVE_SHEET };

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).to.be.ok;
        });

        it('should not return the same object if value changes', function () {
            const initialState = { sheet: {}, dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });

        it('should return the same object if value does not change', function () {
            const initialState = { sheet: {}, dirty: true };
            expect(reducer(initialState, action)).to.equal(initialState);
        });
    });
});