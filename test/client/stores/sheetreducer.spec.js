import {expect} from 'chai';
import sinon from 'sinon';
import Constants from 'client/constants/appconstants';

const proxyquire = require('proxyquire');
proxyquire.noCallThru();
proxyquire.noPreserveCache();

const expenseFactoryStub = sinon.stub();
const participantFactoryStub = sinon.stub();

const reducer = proxyquire('client/stores/sheetreducer', {
    'client/factory/expensefactory': expenseFactoryStub,
    'client/factory/participantfactory': participantFactoryStub
}).sheetReducer;

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
        const findByIndex = function(arr, id) {
            return arr.findIndex(e => e.id === id);
        };

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
                const action = { type: Constants.ActionTypes.ADD_PARTICIPANT, participant };

                it('should add participant to sheet\'s participants', function () {
                    participantFactoryStub.returns(participant);

                    const sheet = reducer(initialState, action);

                    expect(sheet.participants).to.have.lengthOf(1);
                    expect(sheet.participants[0]).to.equal(participant);

                    expect(sheet.participants).not.to.equal(initialState.participants);
                });

                it('should not modify the original array', function () {
                    expect(reducer(initialState, action).participants).not.to.equal(initialState.participants);
                });

                it('should mark sheet dirty', function () {
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });

            describe('remove', function () {
                const action = { type: Constants.ActionTypes.REMOVE_PARTICIPANT, participant };

                it('should mark participant removed', function () {
                    const participants = [{ id: '1' }, { id: '2' }];
                    const initialState = { participants };
                    const sheet = reducer(initialState, action);

                    expect(sheet.participants).to.have.lengthOf(2);
                    expect(sheet.participants[findByIndex(sheet.participants, participant.id)].removed).to.be.ok;
                });

                it('should not modify the original array', function () {
                    expect(reducer(initialState, action).participants).not.to.equal(initialState.participants);
                });

                it('should mark sheet dirty', function () {
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });


        });

        describe('Sheet\'s expenses', function () {
            const expense = { id: '1', name: 'testexpense' };

            describe('add', function () {
                const action = { type: Constants.ActionTypes.ADD_EXPENSE, expense };

                it('should add expense', function () {
                    expenseFactoryStub.returns(expense);
                    const sheet = reducer(initialState, action);
                    expect(sheet.expenses).to.have.lengthOf(1);
                    expect(sheet.expenses[0]).to.equal(expense);
                });

                it('should not modify the original array', function () {
                    expect(reducer(initialState, action).expenses).not.to.equal(initialState.expenses);
                });

                it('should mark sheet dirty', function () {
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });

            describe('remove', function () {
                const action = { type: Constants.ActionTypes.REMOVE_EXPENSE, expense };
                const expenses = [{ id: '1' }, { id: '2' }];
                const initialState = { expenses };

                it('should mark expense removed', function () {
                    const sheet = reducer(initialState, action);
                    expect(sheet.expenses).to.have.lengthOf(2);
                    expect(sheet.expenses[findByIndex(sheet.expenses, expense.id)].removed).to.be.ok;
                });

                it('should not modify the original array', function () {
                    expect(reducer(initialState, action).expenses).not.to.equal(initialState.expenses);
                });

                it('should mark sheet dirty', function () {
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