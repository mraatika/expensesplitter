import {expect} from 'chai';
import {validate} from 'server/validation/sheetvalidator';
import {t} from 'dictionary/dictionary';
import Schema from 'validation/schema';

describe('SheetValidator', function () {
    const validSheet = {
        id: '1',
        name: 'testsheet',
        participants: [],
        expenses: [],
        settings: {}
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
});

