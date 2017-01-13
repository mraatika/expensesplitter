import {expect} from 'chai';
import {validate, findExpensesOfRemovedParticipants, validateExpensesOfRemovedParticipants} from 'common/validation/sheetvalidator';
import {t, tpl} from 'common/dictionary/dictionary';
import Schema from 'common/validation/schema';

describe.only('Validation: SheetValidator', function () {
    const validSheet = {
        id: '1',
        name: 'testsheet',
        participants: [],
        expenses: [],
        settings: {},
        adminKey: '123'
    };

    describe('Validating sheet', function () {

        it('should return an empty object if validation passes', function () {
            expect(Object.keys(validate(validSheet)).length).to.equal(0);
        });

        it('should return failed attribute as a key', function () {
            const invalidSheet = {...validSheet, ...{ id: null }};
            expect(validate(invalidSheet)).to.have.property('id');
        });
    });

    describe('Validating participants', function () {

        it('should pass the validation when participants array is empty', function () {
            expect(validate(validSheet)).not.to.contain.property('participants');
        });

        it('should contain participants error message when the property is invalid', function () {
            const sheet = {...validSheet, ...{ participants: 1 }};
            expect(validate(sheet).participants).to.contain(t(Schema.Sheet.participants.msgKey + '.type'));
        });

        it('should not have property participants all participants are valid', function () {
            const participant = { id: '1', name: 'testparticipant'};
            const sheet = {...validSheet, ...{ participants: [ participant ]}};
            expect(validate(sheet)).not.to.have.property('participants');
        });

        it('should have property participant if a participant is invalid', function () {
            const participant = { id: '1', name: null };
            const sheet = {...validSheet, ...{ participants: [ participant ]}};
            expect(validate(sheet)).to.have.property('participants');
            expect(validate(sheet).participants).to.be.a('string');
        });

        it('should contain participant\'s id whose validation fails', function () {
            const participant = { id: '1', name: null };
            const sheet = {...validSheet, ...{ participants: [ participant ]}};

            expect(validate(sheet).participants).to.contain(`${participant.id}:`);
        });

        it('should contain all validation errors of a participant', function () {
            const participant = { id: null, name: null };
            const sheet = {...validSheet, ...{ participants: [ participant ]}};
            const result = validate(sheet);

            expect(result.participants).to.contain(t(Schema.Participant.id.msgKey + '.required'));
            expect(result.participants).to.contain(t(Schema.Participant.name.msgKey + '.required'));
        });

        it('should contain validation errors from all the invalid participants', function () {
            const participants = [{ id: '111', name: null }, { id: '222', name: null }];
            const sheet = {...validSheet, ...{ participants: participants }};

            const result = validate(sheet);

            expect(result.participants.indexOf(`${participants[0].id}:`)).not.to.equal(-1);
            expect(result.participants.indexOf(`${participants[1].id}:`)).not.to.equal(-1);
        });
    });

    describe('Validating expenses', function () {

        const validExpense = {
            id: '111',
            name: 'testexpense',
            price: 10,
            participants: ['222'],
            payer: '222'
        };

        it('should pass the validation when expenses array is empty', function () {
            expect(validate(validSheet)).not.to.contain.property('expenses');
        });

        it('should contain expenses error message when the property is invalid', function () {
            const sheet = {...validSheet, ...{ expenses: 1 }};
            expect(validate(sheet).expenses).to.contain(t(Schema.Sheet.expenses.msgKey + '.type'));
        });

        it('should not have property expenses if all expenses are valid', function () {
            const sheet = {...validSheet, ...{ expenses: [ validExpense ]}};
            expect(validate(sheet)).not.to.have.property('expenses');
        });

        it('should have property expense if a participant is invalid', function () {
            const expense = { ...validExpense, ...{ name: null }};
            const sheet = {...validSheet, ...{ expenses: [ expense ]}};
            expect(validate(sheet)).to.have.property('expenses');
            expect(validate(sheet).expenses).to.be.a('string');
        });

        it('should contain participant\'s id whose validation fails', function () {
            const expense = { ...validExpense, ...{ name: null }};
            const sheet = {...validSheet, ...{ expenses: [ expense ]}};

            expect(validate(sheet).expenses).to.contain(`${expense.id}:`);
        });

        it('should contain all validation errors of a participant', function () {
            const expense = { ...validExpense, ...{ name: null, price: 'abxc' }};
            const sheet = {...validSheet, ...{ expenses: [ expense ]}};
            const result = validate(sheet);

            expect(result.expenses).to.contain(t(Schema.Expense.name.msgKey + '.required'));
            expect(result.expenses).to.contain(t(Schema.Expense.price.msgKey + '.type'));
        });

        it('should contain validation errors from all the invalid expenses', function () {
            const expenses = [{...validExpense, ...{ name: null }}, {...validExpense, ...{ price: 'abc' }}];
            const sheet = {...validSheet, ...{ expenses: expenses }};

            const result = validate(sheet);

            expect(result.expenses.indexOf(`${expenses[0].id}:`)).not.to.equal(-1);
            expect(result.expenses.indexOf(`${expenses[1].id}:`)).not.to.equal(-1);
        });
    });

    describe('Checking expenses for removed participants', function () {
        it('should return an empty array if expenses is empty', function () {
            const res = findExpensesOfRemovedParticipants([{ id: 1 }], []);
            expect(res).to.be.an('array');
            expect(res).to.be.emtpy;
        });

        it('should return an empty array if expenses is missing', function () {
            const res = findExpensesOfRemovedParticipants([{ id: 1 }]);
            expect(res).to.be.an('array');
            expect(res).to.be.emtpy;
        });

        it('should return an empty array if participants is empty', function () {
            const res = findExpensesOfRemovedParticipants([], [{ participants: [1, 2] }]);
            expect(res).to.be.an('array');
            expect(res).to.be.emtpy;
        });

        it('should return an empty array if participants is not defined', function () {
            const res = findExpensesOfRemovedParticipants(undefined, [{ participants: [1, 2] }]);
            expect(res).to.be.an('array');
            expect(res).to.be.emtpy;
        });

        it('should return expense if a participant is removed', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }];
            const expenses = [{ id: 1, participants: [1, 2], payer: 1 }];

            expect(findExpensesOfRemovedParticipants(participants, expenses)[0]).to.deep.equal(expenses[0]);
        });

        it('should return all the expenses removed participant is participated in', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }];
            const expenses = [
                { id: 1, participants: [1, 2], payer: 1 },
                { id: 2, participants: [1, 2], payer: 1 },
                { id: 3, participants: [1, 2], payer: 1 }
            ];
            const res = findExpensesOfRemovedParticipants(participants, expenses);
            expect(res).to.have.lengthOf(3);
        });

        it('should return expense if it\'s payer is removed', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }];
            const expenses = [{ id: 1, participants: [1], payer: 2 }];

            expect(findExpensesOfRemovedParticipants(participants, expenses)[0]).to.deep.equal(expenses[0]);
        });

        it('should return all the expenses the removed participant is payer of', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }];
            const expenses = [
                { id: 1, participants: [1], payer: 2 },
                { id: 2, participants: [1], payer: 2 },
                { id: 3, participants: [1], payer: 2 }
            ];
            const res = findExpensesOfRemovedParticipants(participants, expenses);
            expect(res).to.have.lengthOf(3);
        });

        it('should return expense once if the removed participant has payed it and also participated in it', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }];
            const expenses = [{ id: 1, participants: [1, 2], payer: 2 }];
            const res = findExpensesOfRemovedParticipants(participants, expenses);
            expect(res).to.have.lengthOf(1);
        });

        it('should return expenses of all removed participants', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }, { id: 3, removed: true }];
            const expenses = [
                { id: 1, participants: [1], payer: 1 },
                { id: 2, participants: [1], payer: 2 },
                { id: 3, participants: [2], payer: 1 },
                { id: 4, participants: [2], payer: 3 },
                { id: 5, participants: [3], payer: 1 },
                { id: 6, participants: [3], payer: 2 }
            ];

            expect(findExpensesOfRemovedParticipants(participants, expenses)).to.have.lengthOf(expenses.length - 1);
        });

        it('should not take removed expenses into account', function () {
            const participants = [{ id: 1 }, { id: 2, removed: true }];
            const expenses = [
                { id: 1, participants: [2], payer: 1, removed: true },
                { id: 2, participants: [1], payer: 2, removed: true }
            ];

            expect(findExpensesOfRemovedParticipants(participants, expenses)).to.be.empty;
        });
    });

    describe('Validating expenses of removed participants', function () {
        it('should return undefined if none is found', function () {
            const participants = [{ id: 1 }, { id: 2 }];
            const expenses = [{ id: 1, participants: [1, 2], payer: 2 }];
            expect(validateExpensesOfRemovedParticipants({participants, expenses})).to.be.undefined;
        });

        it('should return an error message for the removed expense', function () {
            const sheetName = 'TestSheet';
            const participantName = 'TestParticipant';
            const participants = [{ id: 1 }, { id: 2, removed: true, name: participantName }];
            const expenses = [
                { id: 1, participants: [1, 2], payer: 2, name: 'TestExpense1' },
                { id: 2, participants: [1], payer: 2, name: 'TestExpense2' }
            ];
            const errorMsg = tpl('error.server.contains_removed_participant', {
                sheetName,
                expenseNames: expenses.map(e=>e.name).join(', ')
            });

            expect(validateExpensesOfRemovedParticipants({name: sheetName, participants, expenses})).to.equal(errorMsg);
        });
    });
});

