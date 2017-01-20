import {expect} from 'chai';
import reducer, {
    toggleSettingsSection,
    toggleNewSheetAdded,
    toggleLoadSheetDialog,
    TOGGLE_LOAD_SHEET_DIALOG,
    TOGGLE_NEW_SHEET_MESSAGE,
    TOGGLE_SETTINGS_SECTION
} from 'client/stores/uireducer';
import {
    SAVE_SHEET,
    SAVE_SHEET_SUCCESS,
    LOAD_SHEET,
    SAVE_SHEET_FAIL,
    LOAD_SHEET_FAIL,
    LOAD_SHEET_SUCCESS
} from 'client/stores/sheetreducer';

describe('Reducer:UiReducer', function () {

    describe('initial state', function () {
        it('should return an empty object', function () {
            expect(reducer(undefined, {})).to.be.an('object');
            expect(reducer(undefined, {})).to.be.empty;
        });
    });

    describe('Toggling load sheet dialog', function () {
        const toggleAction = { type: TOGGLE_LOAD_SHEET_DIALOG, state: true };
        const loadSheetEvent = { type: LOAD_SHEET_SUCCESS };

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
        const toggleAction = { type: TOGGLE_NEW_SHEET_MESSAGE, state: true };
        const loadSheetEvent = { type: LOAD_SHEET_SUCCESS };

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
        const loadSheetAction = { type: LOAD_SHEET };
        const loadSheetEvent = { type: LOAD_SHEET_SUCCESS };
        const loadSheetError = { type: LOAD_SHEET_FAIL };

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
        const saveSheetAction = { type: SAVE_SHEET };
        const saveSheetEvent = { type: SAVE_SHEET_SUCCESS };
        const saveSheetError = { type: SAVE_SHEET_FAIL };

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

    describe('Toggling settings section', function () {
        const toggleAction = { type: TOGGLE_SETTINGS_SECTION, state: true };

        it('should set showSettings', function () {
            expect(reducer({}, toggleAction).showSettings).to.be.ok;
        });
    });

    describe('Actions: UIActionCreators', function () {
        describe('toggle sheet dialog', function () {
            it('should dispatch an event with state', function () {
                const res = toggleLoadSheetDialog(true);
                expect(res.type).to.equal(TOGGLE_LOAD_SHEET_DIALOG);
                expect(res.state).to.be.ok;
            });
        });

        describe('toggle new sheet added message', function () {
            it('should dispatch an event with state', function () {
                const res = toggleNewSheetAdded(true);
                expect(res.type).to.equal(TOGGLE_NEW_SHEET_MESSAGE);
                expect(res.state).to.be.ok;
            });
        });

        describe('toggle settings section', function () {
            it('should dispatch event with state', function () {
                const res = toggleSettingsSection(true);
                expect(res.type).to.equal(TOGGLE_SETTINGS_SECTION);
                expect(res.state).to.be.ok;
            });
        });
    });
});