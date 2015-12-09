/*jest.dontMock('../../stores/datastore');

import sinon from 'sinon';

const DataStore = require('../../stores/sheetstore').default;
const ActionCreators = require('../../actions/dataactioncreators').default;
const Constants = require('../../constants/AppConstants').default;

describe('DataStore', function() {

    const storageMock = {
        get: jest.genMockFunction(),
        set: jest.genMockFunction(),
        remove: jest.genMockFunction()
    };

    const initDataStore = (sheets, currentSheet) => {
        var stub = sinon.stub(storageMock, 'get');

        stub.withArgs('currentSheetId').returns((currentSheet || {}).id);
        stub.returns(currentSheet);

        DataStore.init(storageMock);
    };

    afterEach(function() {
        DataStore.removeAllListeners();
        storageMock.get.restore();
    });

    describe('Sheet', function () {

        describe('Creating a sheet', function () {
            beforeEach(() => initDataStore([]));

            it('should fire change event after sheet is succesfully added', function () {
                var spy = jasmine.createSpy();

                DataStore.addChangeListener(spy);

                ActionCreators.addSheet('roadtrip');

                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.ADD_SHEET_EVENT);
            });

            it('should throw an error when trying to add sheet without name', function () {
                var expectedError = 'IllegalArgumentsException: sheetName missing or invalid!';

                expect(function() {
                    ActionCreators.addSheet();
                }).toThrow(expectedError);

                expect(function() {
                    ActionCreators.addSheet(' ');
                }).toThrow(expectedError);
            });
        });

        describe('Removing a sheet', function () {
            const sheets = [{ id: '1'},{ id: '2'},{ id: '3'}];

            beforeEach(() => initDataStore(sheets, sheets[1]));

            it('should fire change event after a sheet is succesfully removed', function () {
                var sheetId = sheets[0].id;
                var spy = jasmine.createSpy();
                spyOn(storageMock, 'remove');

                DataStore.addChangeListener(spy);

                ActionCreators.removeSheet(sheetId);

                expect(storageMock.remove).toHaveBeenCalledWith(sheets[0].id);
                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.REMOVE_SHEET_EVENT);

                storageMock.remove.reset();
            });

            it('should clear current sheet if removing the current sheet', function () {
                spyOn(storageMock, 'remove');

                ActionCreators.removeSheet(sheets[1].id);

                expect(storageMock.remove).toHaveBeenCalledWith('currentSheetId');

                storageMock.remove.reset();
            });

            it('should throw an error when trying to remove sheet without sheet id', function () {
                var expectedError = 'IllegalArgumentsException: sheetId is missing or invalid!';

                spyOn(storageMock, 'remove');

                expect(function() {
                    ActionCreators.removeSheet();
                }).toThrow(expectedError);

                expect(function() {
                    ActionCreators.removeSheet(' ');
                }).toThrow(expectedError);

                expect(storageMock.remove).not.toHaveBeenCalled();

                storageMock.remove.reset();
            });
        });
    });

    describe('Participant', function () {

        describe('Creating a participant', function () {
            const sheets = [{ id: '2', participants: []}];

            beforeEach(() => initDataStore(sheets, sheets[0]));

            it('should fire a change event after participant is succesfully added', function () {
                var spy = jasmine.createSpy();

                DataStore.addChangeListener(spy);

                ActionCreators.addParticipant({ name: 'Jorkki' });

                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.ADD_PARTICIPANT_EVENT);
                expect(spy.callCount).toEqual(1);
            });

            it('should fire an error event when trying to add participant with invalid name', function () {
                var errorSpy = jasmine.createSpy();
                var changeSpy = jasmine.createSpy();

                DataStore.addErrorListener(errorSpy);
                DataStore.addChangeListener(changeSpy);

                ActionCreators.addParticipant({ name: '' });

                expect(errorSpy.callCount).toEqual(1);
                expect(errorSpy.mostRecentCall.args[0]).toEqual(Constants.ErrorEventTypes.ADD_PARTICIPANT);
                expect(errorSpy.mostRecentCall.args[1].name).toBeDefined();
                expect(changeSpy).not.toHaveBeenCalled();
            });

            it('should throw when trying to add participant without properties', function () {
                expect(function() {
                    ActionCreators.addParticipant();
                }).toThrow('IllegalArgumentsException: participantProperties missing!');
            });
        });

        describe('Removing a participant', function () {

            it('should throw when trying to remove non existing participant', function () {
                const sheet = { id: '2', participants: [], expenses: []};
                initDataStore([sheet], sheet);

                expect(function() {
                    ActionCreators.removeParticipant({ id: '1' });
                }).toThrow('Unable to remove entity: Entity with id 1 not found!');
            });

            it('should remove a participant with id', function () {
                const sheet = { id: '2', participants: [{ id: '2', name: 'Seppo'}], expenses: []};
                initDataStore([sheet], sheet);

                const spy = jasmine.createSpy();
                DataStore.addChangeListener(spy);

                ActionCreators.removeParticipant({ id: '2' });

                expect(spy.callCount).toEqual(1);
                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.REMOVE_PARTICIPANT_EVENT);
                expect(sheet.participants.length).toEqual(0);
            });

            it('should remove all the expenses of the to-be-removed participant', function () {
                const expenses = [
                    { id: '1', name: 'beer', price: 1, participants: ['1', '2'], payer: '1' },
                    { id: '2', name: 'sausage', price: 1, participants: ['2'], payer: '1' },
                    { id: '3', name: 'pizza', price: 1, participants: ['1'], payer: '2' },
                    { id: '4', name: 'coke', price: 1, participants: ['3'], payer: '1' }
                ];
                const sheet = { id: '2', participants: [{ id: '2', name: 'Seppo'}], expenses: expenses};
                initDataStore([sheet], sheet);

                const spy = jasmine.createSpy();

                DataStore.addChangeListener(spy);

                ActionCreators.removeParticipant({ id: '2' });
                expect(spy.callCount).toEqual(1);
                expect(sheet.participants.length).toEqual(0);
                expect(sheet.expenses.length).toEqual(1);
                expect(sheet.expenses[0].id).toEqual('4');
            });
        });
    });

    describe('Expense', function () {
        describe('Creating an expense', function () {
            const sheets = [{ id: '2', expenses: []}];

            beforeEach(() => initDataStore(sheets, sheets[0]));

            it('should fire a change event after expense is succesfully created', function () {
                var spy = jasmine.createSpy();

                DataStore.addChangeListener(spy);

                ActionCreators.addExpense({ name: 'beer', price: 1, participants: [1], payer: 1 });

                expect(spy.callCount).toEqual(1);
                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.ADD_EXPENSE_EVENT);
            });

            it('should fire an error event when trying to add expense with invalid props', function () {
                var errorSpy = jasmine.createSpy();
                var changeSpy = jasmine.createSpy();

                DataStore.addErrorListener(errorSpy);
                DataStore.addChangeListener(changeSpy);

                ActionCreators.addExpense({ name: 'gas', price: -5, participants: [] });

                var errors = errorSpy.mostRecentCall.args[1];
                expect(errorSpy.callCount).toEqual(1);
                expect(errorSpy.mostRecentCall.args[0]).toEqual(Constants.ErrorEventTypes.ADD_EXPENSE);
                expect(errors.name).not.toBeDefined();
                expect(errors.price).toBeDefined();
                expect(errors.participants).toBeDefined();
                expect(errors.payer).toBeDefined();

                expect(changeSpy).not.toHaveBeenCalled();
            });

            it('should throw when trying to add participant without properties', function () {
                expect(function() {
                    ActionCreators.addExpense();
                }).toThrow('IllegalArgumentsException: expenseProperties are missing!');
            });
        });

        describe('Removing an expense', function () {
            const expense = { id:'2', name: 'food', price: 20, participants: [1,2], payer: 2 };
            const sheet = { id: '2', expenses: [expense]};

            beforeEach(() => initDataStore([sheet], sheet));

            it('should throw when trying to remove non existing expense', function () {
                expect(function() {
                    ActionCreators.removeExpense({ id: '1' });
                }).toThrow('Unable to remove entity: Entity with id 1 not found!');
            });

            it('should remove a participant with id', function () {
                var spy = jasmine.createSpy();
                DataStore.addChangeListener(spy);

                ActionCreators.removeExpense(expense);

                expect(spy.callCount).toEqual(1);
                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.REMOVE_EXPENSE_EVENT);
                expect(sheet.expenses.length).toEqual(0);
            });
        });
    });
});*/