jest.autoMockOff();

const DataStore = require('../../stores/datastore');
const ActionCreators = require('../../actions/dataactioncreators');
const Constants = require('../../constants/AppConstants');

var sheets = [
    {
        id: '1',
        participants: [],
        expenses: []
    },
    {
        id: '2',
        participants: [],
        expenses: []
    },
    {
        id: '3',
        participants: [],
        expenses: []
    }
];

var currentSheetId = '1';

var storageMock = {
    get: jest.genMockFunction().mockImplementation(function(key) {
        if (key === 'currentSheetId') return currentSheetId;
        return sheets[key];
    }),
    set: jest.genMockFunction(),
    remove: jest.genMockFunction()
};

describe('DataStore', function() {

    beforeEach(function () {
        DataStore.init(storageMock);
    });

    afterEach(function() {
        DataStore.removeAllListeners();
        sheets.forEach((s) => {
            s.participants = [];
            s.expenses = [];
        });
    });

    describe('Sheet', function () {
        describe('Creating a sheet', function () {

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

            it('should fire change event after a sheet is succesfully removed', function () {
                var sheetId = '2';
                var spy = jasmine.createSpy();
                spyOn(storageMock, 'remove');

                DataStore.addChangeListener(spy);

                ActionCreators.removeSheet(sheetId);

                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.REMOVE_SHEET_EVENT);
                expect(storageMock.remove).toHaveBeenCalledWith(sheetId);

                storageMock.remove.reset();
            });

            it('should clear current sheet if removing the current sheet', function () {
                spyOn(storageMock, 'remove');

                ActionCreators.removeSheet(currentSheetId);

                expect(storageMock.remove).toHaveBeenCalledWith(currentSheetId);
                expect(storageMock.remove).toHaveBeenCalledWith('currentSheetId');

                storageMock.remove.reset();
            });

            it('should throw an error when trying to remove sheet without sheet id', function () {
                var expectedError = 'IllegalArgumentsException: sheetId is missing or invalid!';

                expect(function() {
                    ActionCreators.removeSheet();
                }).toThrow(expectedError);

                expect(function() {
                    ActionCreators.removeSheet(' ');
                }).toThrow(expectedError);
            });
        });
    });

    describe('Participant', function () {
        describe('Creating a participant', function () {

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
                expect(function() {
                    ActionCreators.removeParticipant({ id: '1' });
                }).toThrow('Unable to remove entity: Entity with id 1 not found!');
            });

            it('should remove a participant with id', function () {
                var spy = jasmine.createSpy();
                DataStore.addChangeListener(spy);

                sheets[currentSheetId].participants.push({ id: '2', name: 'Seppo'});
                ActionCreators.removeParticipant({ id: '2' });

                expect(spy.callCount).toEqual(1);
                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.REMOVE_PARTICIPANT_EVENT);
                expect(sheets[currentSheetId].participants.length).toEqual(0);
            });

            it('should remove all the expenses of the to-be-removed participant', function () {
                var spy = jasmine.createSpy();
                var currentSheet = sheets[currentSheetId];

                DataStore.addChangeListener(spy);

                sheets[currentSheetId].participants.push({ id: 2, name: 'Seppo'});
                sheets[currentSheetId].expenses.push(
                    { id: 1, name: 'beer', price: 1, participants: [1, 2], payer: 1 },
                    { id: 2, name: 'sausage', price: 1, participants: [2], payer: 1 },
                    { id: 3, name: 'pizza', price: 1, participants: [1], payer: 2 },
                    { id: 4, name: 'coke', price: 1, participants: [3], payer: 1 }
                );

                let remainingExpenses = currentSheet.expenses.filter(expense => expense.id === 4);

                ActionCreators.removeParticipant({ id: 2 });
                expect(spy.callCount).toEqual(1);
                expect(currentSheet.participants.length).toEqual(0);
                expect(currentSheet.expenses.length).toEqual(1);
                expect(remainingExpenses.length).toEqual(1);
            });
        });
    });

    describe('Expense', function () {
        describe('Creating an expense', function () {

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

        describe('Removing a participant', function () {

            it('should throw when trying to remove non existing participant', function () {
                expect(function() {
                    ActionCreators.removeExpense({ id: '1' });
                }).toThrow('Unable to remove entity: Entity with id 1 not found!');
            });

            it('should remove a participant with id', function () {
                var spy = jasmine.createSpy();
                var expense =  { id:'2', name: 'food', price: 20, participants: [1,2], payer: 2 };
                DataStore.addChangeListener(spy);

                sheets[currentSheetId].expenses.push(expense);
                ActionCreators.removeExpense(expense);

                expect(spy.callCount).toEqual(1);
                expect(spy).toHaveBeenCalledWith(Constants.EventTypes.REMOVE_EXPENSE_EVENT);
                expect(sheets[currentSheetId].expenses.length).toEqual(0);
            });
        });
    });
});