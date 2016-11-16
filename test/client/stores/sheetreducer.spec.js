import {expect} from 'chai';
import sinon from 'sinon';
import {findIndex} from 'lodash';
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

    describe('Updating', function () {
        const initialState = { dirty: false, sheet: { id: '123', name: 'testsheet1', participants: [] }};
        const update = { id: '123', name: 'testsheet2', prop: 'abc' };
        const action = { type: Constants.ActionTypes.UPDATE_SHEET, update };
        const findByIndex = function(arr, id) {
            return findIndex(arr, e => e.id === id);
        };

        describe('sheet', function () {
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

        describe('Sheet\'s participants', function () {
            const participant = { id: '1', name: 'testname' };

            it('should add participant', function () {
                participantFactoryStub.returns(participant);
                const action = { type: Constants.ActionTypes.ADD_PARTICIPANT, participant };
                const {sheet} = reducer(initialState, action);
                expect(sheet.participants).to.have.lengthOf(1);
                expect(sheet.participants[0]).to.equal(participant);
            });

            it('should mark participant removed', function () {
                const participants = [{ id: '1' }, { id: '2' }];
                const initialState = { sheet: { participants }};
                const action = { type: Constants.ActionTypes.REMOVE_PARTICIPANT, participant };
                const {sheet} = reducer(initialState, action);
                expect(sheet.participants).to.have.lengthOf(2);
                expect(sheet.participants[findByIndex(sheet.participants, participant.id)].removed).to.be.ok;
            });
        });

        describe('Sheet\'s expenses', function () {
            const expense = { id: '1', name: 'testexpense' };

            it('should add expense', function () {
                expenseFactoryStub.returns(expense);
                const action = { type: Constants.ActionTypes.ADD_EXPENSE, expense };
                const {sheet} = reducer(initialState, action);
                expect(sheet.expenses).to.have.lengthOf(1);
                expect(sheet.expenses[0]).to.equal(expense);
            });

            it('should mark expense removed', function () {
                const expenses = [{ id: '1' }, { id: '2' }];
                const initialState = { sheet: { expenses }};
                const action = { type: Constants.ActionTypes.REMOVE_EXPENSE, expense };
                const {sheet} = reducer(initialState, action);
                expect(sheet.expenses).to.have.lengthOf(2);
                expect(sheet.expenses[findByIndex(sheet.expenses, expense.id)].removed).to.be.ok;
            });
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