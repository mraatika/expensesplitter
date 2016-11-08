import {expect} from 'chai';
import Constants from 'client/constants/appconstants';
import {uiReducer as reducer} from 'client/stores/uireducer';

describe('Reducer:UiReducer', function () {

    describe('initial state', function () {
        it('should return an empty object', function () {
            expect(reducer(undefined, {})).to.be.an('object');
            expect(reducer(undefined, {})).to.be.empty;
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

    describe('Toggling loading dialog', function () {
        const loadSheetAction = { type: Constants.ActionTypes.LOAD_SHEET };
        const loadSheetEvent = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS };
        const loadSheetError = { type: Constants.ErrorEventTypes.LOAD_SHEET };

        it('should set isFetching true when beginning to fetch', function () {
            expect(reducer({}, loadSheetAction).isFetching).to.be.ok;
        });

        it('should set isFetching false after successfull fetch', function () {
            expect(reducer({ isFetching: true }, loadSheetEvent).isFetching).not.to.be.ok;
        });

        it('should set isFetching false when fetch fails', function () {
            expect(reducer({ isFetching: true }, loadSheetError).isFetching).not.to.be.ok;
        });
    });

    describe('Toggling sheet save status', function () {
        const saveSheetAction = { type: Constants.ActionTypes.SAVE_SHEET };
        const saveSheetEvent = { type: Constants.EventTypes.SAVE_SHEET_SUCCESS };
        const saveSheetError = { type: Constants.ErrorEventTypes.SAVE_SHEET };

        it('should set isFetching true when beginning to save', function () {
            expect(reducer({}, saveSheetAction).isSavingToServer).to.be.ok;
        });

        it('should set isFetching false when save was successfull', function () {
            expect(reducer({ isSavingToServer: true }, saveSheetEvent).isSavingToServer).not.to.be.ok;
        });

        it('should set isFetching false when save fails', function () {
            expect(reducer({ isSavingToServer: true }, saveSheetError).isSavingToServer).not.to.be.ok;
        });
    });
});