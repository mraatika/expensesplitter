import sinon from 'sinon';
import {expect} from 'chai';
import Constants from '../../src/js/constants/AppConstants';
import AppDispatcher from '../../src/js/dispatchers/appdispatcher.js';
import ExpenseFactory from '../../src/js/factory/expensefactory.js';
import validation from '../../src/js/validation/validation.js';

describe('ExpenseStore', function () {

    var ExpenseStore;

    before(() => {
        sinon.stub(AppDispatcher, 'register');
        ExpenseStore = require('../../src/js/stores/expensestore.js').default;
    });

    after(() => {
        AppDispatcher.register.restore();
    });

    beforeEach(() => {
        sinon.stub(ExpenseFactory, 'create');
        sinon.stub(validation, 'validate').returns({});
    });

    afterEach(() => {
        ExpenseFactory.create.restore();
        validation.validate.restore();
        ExpenseStore.removeAllListeners();
    });

    const getDispatchIndex = () => {
        return AppDispatcher.register.getCall(AppDispatcher.register.callCount -1).args[0];
    };

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

    it('should register a callback with the dispatcher', function () {
        expect(AppDispatcher.register.called).to.be.ok;
    });

    it('should return an empty array when getSheet is called without sheetId', function () {
        expect(ExpenseStore.getExpenses()).to.be.an('array');
    });

    describe('ACTIONS', function () {

        describe('Creating an expense', function () {
            const sheetId = '1';

            afterEach(() => {
                getDispatchIndex()(removeAllPayload(sheetId));
            });

            it('should add a valid expense to the store', function () {
                const expense = { id: '1', amount: 100 };
                ExpenseFactory.create.returns(expense);
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(0);
                getDispatchIndex()(createPayload(expense, sheetId));
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(1);
            });

            it('should not add same expense twice', function () {
                const expense = { id: '1' };
                ExpenseFactory.create.returns(expense);
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(0);
                getDispatchIndex()(createPayload(expense, sheetId));
                getDispatchIndex()(createPayload(expense, sheetId));
                expect(ExpenseStore.getExpenses(sheetId).length).to.equal(1);
            });

            it('should fire a change event after expense is succesfully created', function () {
                const expense = { id: '2', amount: 102 };
                const spy = sinon.spy();

                ExpenseFactory.create.returns(expense);

                ExpenseStore.addChangeListener(spy);

                getDispatchIndex()(createPayload(expense, sheetId));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

            it('should fire an error event when trying to add expense with invalid props', function () {
                const spy = sinon.spy();
                const expense = { id: '3', amount: 103 };

                ExpenseFactory.create.returns(expense);
                validation.validate.returns({ amount: true });

                ExpenseStore.addChangeListener(spy);

                getDispatchIndex()(createPayload(expense, sheetId));

                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_EXPENSE)).to.be.ok;
            });

            it('should also connect expense with given id', function () {
                const expense = { id: '4', amount: 100 };
                ExpenseFactory.create.returns(expense);
                getDispatchIndex()(createPayload(expense, sheetId));
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
                    ExpenseFactory.create.returns(expense);
                    getDispatchIndex()(createPayload(expense, sheetId));
                });
            });

            afterEach(() => {
                getDispatchIndex()(removeAllPayload(sheetId));
            });

            describe('Removing a single expense', function () {
                it('should remove a participant with id', function () {
                    getDispatchIndex()(removePayload(expenses[0]));
                    expect(ExpenseStore.getExpense(expenses[0].id)).to.be.undefined;
                });

                it('should also remove expense from the sheet expense connection array', function () {
                    getDispatchIndex()(removePayload(expenses[0]));
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(2);
                });

                it('should emit a change event after an expense is removed', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    getDispatchIndex()(removePayload(expenses[0]));
                    expect(spy.callCount).to.equal(1);
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should no emit a change event if expense is not found', function () {
                    const spy = sinon.spy();
                    const expense = { 'id': '444' };
                    ExpenseStore.addChangeListener(spy);
                    getDispatchIndex()(removePayload(expense));
                    expect(spy.called).not.to.be.ok;
                });
            });

            describe('Removing all expenses of a sheet', function () {
                it('should remove all the expenses of a sheet from the store', function () {
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(3);
                    getDispatchIndex()(removeAllPayload(sheetId));
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(0);
                });

                it('should emit a change event after removal', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    getDispatchIndex()(removeAllPayload(sheetId));
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should not emit a change event if all removals fail', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    getDispatchIndex()(removeAllPayload(sheetId));
                    getDispatchIndex()(removeAllPayload(sheetId));
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
                    getDispatchIndex()(removeExpensesOfParticipantPayload());
                    expect(ExpenseStore.getExpense(expenses[0].id)).to.be.undefined;
                    expect(ExpenseStore.getExpense(expenses[2].id)).not.to.be.undefined;
                });

                it('should remove expenses the participant has paid', function () {
                    expect(ExpenseStore.getExpenses(sheetId).length).to.equal(3);
                    getDispatchIndex()(removeExpensesOfParticipantPayload());
                    expect(ExpenseStore.getExpense(expenses[1].id)).to.be.undefined;
                    expect(ExpenseStore.getExpense(expenses[2].id)).not.to.be.undefined;
                });

                it('should emit a change event after removal', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    getDispatchIndex()(removeExpensesOfParticipantPayload(sheetId));
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should not emit a change event if all removals fail', function () {
                    const spy = sinon.spy();
                    ExpenseStore.addChangeListener(spy);
                    getDispatchIndex()(removeExpensesOfParticipantPayload(sheetId));
                    getDispatchIndex()(removeExpensesOfParticipantPayload(sheetId));
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

        beforeEach(() => {
            sinon.stub(AppDispatcher, 'waitFor').returns(true);
        });

        afterEach(() => {
            AppDispatcher.waitFor.restore();
        });

        describe('Load sheet success event', function () {
            it('should add all expenses of a sheet to the store', function () {
                expect(ExpenseStore.getExpenses(sheet.id).length).to.equal(0);
                getDispatchIndex()(loadSheetSuccessPayload());
                expect(ExpenseStore.getExpenses(sheet.id).length).to.equal(2);
            });

            it('should emit a change event after', function () {
                const spy = sinon.spy();
                ExpenseStore.addChangeListener(spy);
                getDispatchIndex()(loadSheetSuccessPayload());
                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

            it('should emit an error event if at least one of the adds fails', function () {
                const spy = sinon.spy();
                validation.validate.withArgs(sheet.expenses[1]).returns({ amount: true });
                ExpenseStore.addChangeListener(spy);
                getDispatchIndex()(loadSheetSuccessPayload());
                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_EXPENSE)).to.be.ok;
            });
        });
    });
});