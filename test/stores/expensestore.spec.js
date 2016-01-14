import sinon from 'sinon';
import {expect} from 'chai';
import getStubs from '../support/stubs.js';
import Constants from '../../src/js/constants/AppConstants';

const proxyquire = require('proxyquire').noCallThru();

describe('ExpenseStore', function () {

    let ExpenseStore;
    let dispatch;
    const stubs = getStubs();

    before(() => {
        ExpenseStore = proxyquire('../../src/js/stores/expensestore.js', {
            './participantstore.js': {},
            '../dispatchers/appdispatcher.js': stubs.dispatcher,
            '../validation/validation': stubs.validation,
            '../factory/expensefactory.js': stubs.factory
        }).default;

        dispatch = stubs.dispatcher.register.getCall(0).args[0];
    });

    afterEach(() => {
        ExpenseStore.removeAllListeners();
    });

    const createPayload = (expense, sheetId) => {
        return {
            action: {
                type: Constants.ActionTypes.ADD_EXPENSE,
                expense: expense,
                sheetId: sheetId
            }
        };
    };

    const removePayload = (expense) => {
        return {
            action: {
                type: Constants.ActionTypes.REMOVE_EXPENSE,
                expense: expense
            }
        };
    };

    const removeAllPayload = sheetId => {
        return {
            action: {
                type: Constants.ActionTypes.REMOVE_ALL_EXPENSES,
                sheetId: sheetId
            }
        };
    };

    const removeAll = sheetId => {
        ExpenseStore.getExpenses(sheetId).forEach(e => dispatch(removePayload(e)));
    };

    it('should register a callback with the dispatcher', function () {
        expect(stubs.dispatcher.register.called).to.be.ok;
    });

    it('should return an empty array when getSheet is called without sheetId', function () {
        expect(ExpenseStore.getExpenses()).to.be.an('array');
    });

    describe('ACTIONS', function () {

        describe('Creating an expense', function () {
            const sheetId = '1';

            afterEach(() => {
                dispatch(removeAllPayload(sheetId));
            });

            it('should add a valid expense to the store', function () {
                const expense = { id: '1', amount: 100 };
                stubs.factory.create.returns(expense);
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(0);
                dispatch(createPayload(expense, sheetId));
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(1);
            });

            it('should not add same expense twice', function () {
                const expense = { id: '1' };
                stubs.factory.create.returns(expense);
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(0);
                dispatch(createPayload(expense, sheetId));
                dispatch(createPayload(expense, sheetId));
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(1);
            });

            it('should fire a change event after expense is succesfully created', function () {
                const expense = { id: '2', amount: 102 };
                const spy = sinon.spy();

                stubs.factory.create.returns(expense);

                ExpenseStore.addChangeListener(spy);

                dispatch(createPayload(expense, sheetId));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

            it('should fire an error event when trying to add expense with invalid props', function () {
                const spy = sinon.spy();
                const expense = { id: '3', amount: 103 };

                stubs.factory.create.returns(expense);
                stubs.validation.validate.returns({ amount: true });

                ExpenseStore.addChangeListener(spy);

                dispatch(createPayload(expense, sheetId));

                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_EXPENSE)).to.be.ok;
                // reset return value
                stubs.validation.validate.returns({});
            });

            it('should also connect expense with given id', function () {
                const expense = { id: '4', amount: 100 };
                stubs.factory.create.returns(expense);
                dispatch(createPayload(expense, sheetId));
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(1);
            });
        });

        describe('Removing expenses', function () {
            const expenses = [
                { id:'1', name: 'beer', participants: ['1', '2'], payer:'3' },
                { id:'2', name: 'food', participants: ['3'], payer: '1'},
                { id:'3', name: 'gas', participants: ['2', '3'], payer: '2' }
            ];
            const sheetId = '2';

            beforeEach(() => {
                expenses.forEach(expense => {
                    stubs.factory.create.returns(expense);
                    dispatch(createPayload(expense, sheetId));
                });
            });

            afterEach(() => {
                dispatch(removeAllPayload(sheetId));
            });

            describe('Removing a single expense', function () {
                it('should remove a participant with id', function () {
                    dispatch(removePayload(expenses[0]));
                    expect(ExpenseStore.getExpense(expenses[0].id)).to.be.undefined;
                });

                it('should also remove expense from the sheet expense connection array', function () {
                    dispatch(removePayload(expenses[0]));
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(2);
                });

                it('should emit a change event after an expense is removed', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    dispatch(removePayload(expenses[0]));
                    expect(spy.callCount).to.equal(1);
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should no emit a change event if expense is not found', function () {
                    const spy = sinon.spy();
                    const expense = { 'id': '444' };
                    ExpenseStore.addChangeListener(spy);
                    dispatch(removePayload(expense));
                    expect(spy.called).not.to.be.ok;
                });
            });

            describe('Removing all expenses of a sheet', function () {
                it('should remove all the expenses of a sheet from the store', function () {
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(3);
                    dispatch(removeAllPayload(sheetId));
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(0);
                });

                it('should emit a change event after removal', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    dispatch(removeAllPayload(sheetId));
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should not emit a change event if all removals fail', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    dispatch(removeAllPayload(sheetId));
                    dispatch(removeAllPayload(sheetId));
                    expect(spy.callCount).to.equal(1);
                });
            });

            describe('Removing expenses of a participant', function () {
                const removeExpensesOfParticipantPayload = () => {
                    return {
                        action: {
                            type: Constants.ActionTypes.REMOVE_PARTICIPANT,
                            participant: { id: '1' }
                        }
                    };
                };
                it('should remove expenses in whitch the participant is participated in', function () {
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(3);
                    dispatch(removeExpensesOfParticipantPayload());
                    expect(ExpenseStore.getExpense(expenses[0].id)).to.be.undefined;
                    expect(ExpenseStore.getExpense(expenses[2].id)).not.to.be.undefined;
                });

                it('should remove expenses the participant has paid', function () {
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(3);
                    dispatch(removeExpensesOfParticipantPayload());
                    expect(ExpenseStore.getExpense(expenses[1].id)).to.be.undefined;
                    expect(ExpenseStore.getExpense(expenses[2].id)).not.to.be.undefined;
                });

                it('should emit a change event after removal', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    dispatch(removeExpensesOfParticipantPayload(sheetId));
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should not emit a change event if all removals fail', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    dispatch(removeExpensesOfParticipantPayload(sheetId));
                    dispatch(removeExpensesOfParticipantPayload(sheetId));
                    expect(spy.callCount).to.equal(1);
                });
            });
        });
    });

    describe('EVENTS', function () {
        const sheet = {
            id: '1',
            expenses: [{ id: '1' }, { id: '2'}]
        };

        const loadSheetSuccessPayload = () => {
            return {
                action: {
                    type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
                    sheet: sheet
                }
            };
        };

        describe('Load sheet success event', function () {

            beforeEach(() => removeAll(sheet.id));

            it('should add all expenses of a sheet to the store', function () {
                expect(ExpenseStore.getExpenses(sheet.id).length).to.equal(0);
                dispatch(loadSheetSuccessPayload());
                expect(ExpenseStore.getExpenses(sheet.id).length).to.equal(2);
            });

            it('should not add doubles with add all action', function () {
                expect(ExpenseStore.getExpenses(sheet.id).length).to.equal(0);
                dispatch(loadSheetSuccessPayload());
                dispatch(loadSheetSuccessPayload());
                expect(ExpenseStore.getExpenses(sheet.id).length).to.equal(2);
            });

            it('should emit a change event after', function () {
                const spy = sinon.spy();
                ExpenseStore.addChangeListener(spy);
                dispatch(loadSheetSuccessPayload());
                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

            it('should emit an error event if at least one of the adds fails', function () {
                const spy = sinon.spy();
                stubs.validation.validate.withArgs(sheet.expenses[1]).returns({ amount: true });
                ExpenseStore.addChangeListener(spy);
                dispatch(loadSheetSuccessPayload());
                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_EXPENSE)).to.be.ok;
                // reset return value
                stubs.validation.validate.returns({});
            });
        });
    });
});