import {expect} from 'chai';
import sinon from 'sinon';
import Constants from 'client/constants/appconstants';

const proxyquire = require('proxyquire');
proxyquire.noCallThru();
proxyquire.noPreserveCache();

const expenseFactoryStub = sinon.stub();

const reducer = proxyquire('client/stores/expensesreducer', {
    'client/factory/expensefactory': expenseFactoryStub
}).expensesReducer;

describe('Reducer:ParticipantsReducer', function () {
    const initialState = [];
    const expense = { id: '1', name: 'testexpense' };
    const findByIndex = function(arr, id) {
        return arr.findIndex(e => e.id === id);
    };

    describe('Initial state', function () {
        it('should be an empty array', function () {
            const res = reducer(undefined, {});
            expect(res).to.be.an('array');
            expect(res).to.be.empty;
        });

        it('should return default state if action is not handled', function () {
            const initialState = [{ id:1 }];
            const res = reducer(initialState, {});
            expect(res).to.equal(initialState);
        });
    });

    describe('Sheet load', function () {
        const expenses = [ { id: 1 }, { id: 2} ];
        const sheet = { expenses };
        const action = { type: Constants.EventTypes.LOAD_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should add all participants to state when a sheet is loaded', function () {
            const res = reducer(undefined, action);
            expect(res).to.have.lengthOf(expenses.length);
        });
    });

    describe('Sheet create', function () {
        const initialState = [ { id: 1 }, { id: 2} ];
        const action = { type: Constants.ActionTypes.CREATE_SHEET };

        it('should clear the state when a new sheet is created', function () {
            const res = reducer(initialState, action);
            expect(res).to.be.an('array');
            expect(res).to.be.empty;
        });
    });

    describe('Add expense', function () {
        const action = { type: Constants.ActionTypes.ADD_EXPENSE, expense };

        it('should add expense', function () {
            expenseFactoryStub.returns(expense);
            const res = reducer(initialState, action);
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.equal(expense);
        });

        it('should not modify the original array', function () {
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Remove expense', function () {
        const action = { type: Constants.ActionTypes.REMOVE_EXPENSE, expense };
        const initialState = [{ id: '1' }, { id: '2' }];

        it('should mark expense removed', function () {
            const res = reducer(initialState, action);
            expect(res).to.have.lengthOf(2);
            expect(res[findByIndex(res, expense.id)].removed).to.be.ok;
        });

        it('should not modify the original array', function () {
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });
});