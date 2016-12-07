import {expect} from 'chai';
import Constants from 'client/constants/appconstants';
import {sheetReducer as reducer} from 'client/stores/sheetreducer';

describe('Reducer:SheetReducer', function () {

    describe('Initial state', function () {
        it('should initially be an object', function () {
            const res = reducer(undefined, {});
            expect(res).to.be.an('object');
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

        it('should create new sheet', function () {
            const res = reducer({}, action);
            expect(res.name).to.equal(sheet.name);
            expect(res.id).to.be.defined;
        });

        it('should mark sheet dirty', function () {
            const res = reducer({}, action);
            expect(res.dirty).to.be.ok;
        });

        it('should not return same object', function () {
            const initialState = { ...sheet, dirty: true };
            expect(reducer(sheet, action)).not.to.equal(initialState);
        });
    });

    describe('Updating', function () {
        const initialState = { dirty: false, id: '123', name: 'testsheet1', participants: [] };
        const update = { id: '123', name: 'testsheet2', prop: 'abc' };
        const action = { type: Constants.ActionTypes.UPDATE_SHEET, update };

        describe('sheet', function () {
            it('should update sheet with given props', function () {
                const sheet = reducer(initialState, action);
                expect(sheet.id).to.equal(initialState.id);
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

        describe('Sheet\'s participants', function () {
            const participant = { id: '1', name: 'testname' };

            describe('add', function () {
                it('should mark sheet dirty', function () {
                    const action = { type: Constants.ActionTypes.ADD_PARTICIPANT, participant };
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });

            describe('remove', function () {
                it('should mark sheet dirty', function () {
                    const action = { type: Constants.ActionTypes.REMOVE_PARTICIPANT, participant };
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });
        });

        describe('Sheet\'s expenses', function () {
            const expense = { id: '1', name: 'testexpense' };

            describe('add', function () {
                const action = { type: Constants.ActionTypes.ADD_EXPENSE, expense };
                it('should mark sheet dirty', function () {
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });

            describe('remove', function () {

                it('should mark sheet dirty', function () {
                    const action = { type: Constants.ActionTypes.REMOVE_EXPENSE, expense };
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });
        });

    });

    describe('Load sheet success', function () {
        const sheet = { id: '123', name: 'testsheet1' };
        const action = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should set the received sheet to the state', function () {
            const expected = { ...sheet, dirty: false };
            expect(reducer({}, action)).to.deep.equal(expected);
        });

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).not.to.be.ok;
        });

        it('should not return the same object', function () {
            const initialState = { dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Save sheet success', function () {
        const sheet = { id: '123', name: 'testsheet1' };
        const action = { type: Constants.EventTypes.SAVE_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should set the received sheet to the state', function () {
            const expected = { ...sheet, dirty: false };
            expect(reducer({}, action)).to.deep.equal(expected);
        });

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).not.to.be.ok;
        });

        it('should not return the same object', function () {
            const initialState = { dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Save sheet error', function () {
        const action = { type: Constants.ErrorEventTypes.SAVE_SHEET };

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).to.be.ok;
        });

        it('should not return the same object if value changes', function () {
            const initialState = { dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });

        it('should return the same object if value does not change', function () {
            const initialState = { dirty: true };
            expect(reducer(initialState, action)).to.equal(initialState);
        });
    });
});