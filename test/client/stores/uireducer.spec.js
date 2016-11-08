import {expect} from 'chai';
import Constants from 'client/constants/appconstants';
import {uiReducer as reducer} from 'client/stores/uireducer';

describe('Reducer:UiReducer', function () {

    describe('initial state', function () {
        it('should return an empty object', function () {
            expect(reducer(undefined, {})).to.be.an('object');
            expect(Object.keys(reducer(undefined, {})).length).to.equal(0);
        });
    });

    describe('Toggling load sheet dialog', function () {
        const toggleAction = { type: Constants.ActionTypes.TOGGLE_LOAD_SHEET_DIALOG, state: true };
        const loadSheetEvent = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS };

        it('should set state', function () {
            expect(reducer(undefined, toggleAction).showLoadSheetDialog).to.be.ok;
        });

        it('should return a new object when property changes', function () {
            const initialState = { showLoadSheetDialog: false };
            expect(reducer(initialState, toggleAction)).not.to.equal(initialState);
        });

        it('should return same object when property is not changed', function () {
            const initialState = { showLoadSheetDialog: true };
            expect(reducer(initialState, toggleAction)).to.equal(initialState);
        });

        it('should close it when sheet is successfully loaded', function () {
            expect(reducer({ showLoadSheetDialog: true }, loadSheetEvent).showLoadSheetDialog).not.to.be.ok;
        });
    });

    describe('Toggling new sheet message', function () {
        const toggleAction = { type: Constants.ActionTypes.TOGGLE_NEW_SHEET_MESSAGE, state: true };
        const loadSheetEvent = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS };

        it('should set state', function () {
            expect(reducer(undefined, toggleAction).newSheetAdded).to.be.ok;
        });

        it('should return a new object', function () {
            const initialState = {};
            expect(reducer(undefined, toggleAction)).not.to.equal(initialState);
        });

        it('should return a new object when property changes', function () {
            const initialState = { newSheetAdded: false };
            expect(reducer(initialState, toggleAction)).not.to.equal(initialState);
        });

        it('should return same object when property is not changed', function () {
            const initialState = { newSheetAdded: true };
            expect(reducer(initialState, toggleAction)).to.equal(initialState);
        });

        it('should close it when sheet is successfully loaded', function () {
            expect(reducer({ newSheetAdded: true }, loadSheetEvent).newSheetAdded).not.to.be.ok;
        });
    });
});