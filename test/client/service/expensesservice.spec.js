import {expect} from 'chai';
import ExpensesService from 'service/expensesservice';

describe('Service: ExpensesService', function () {
    const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' } ];
    const sheet = {
        participants,
        expenses: [
            {
                name: 'expense1',
                price: 1,
                participants: participants.map(p => p.id),
                payer: participants[0].id
            },
            {
                name: 'expense2',
                price: 2,
                participants: participants.map(p => p.id),
                payer: participants[1].id
            },
            {
                name: 'expense3',
                price: 3,
                participants: [ participants[0].id ],
                payer: participants[1].id
            },
            {
                name: 'expense4',
                price: 4,
                participants: [ participants[0].id ],
                payer: participants[0].id
            }
        ]
    };
    describe('Calculating participant shares', function () {
        let expensesService;

        beforeEach(function () {
            expensesService = new ExpensesService(sheet);
        });

        it('should count sum of all expenses', function () {
            const total = sheet.expenses.reduce((memo, expense) => memo + expense.price, 0);
            expect(expensesService.getTotalSum()).to.equal(total);
        });

        it('should find expenses if the participant is participated in', function () {
            const expenses = expensesService.findExpensesByParticipant(participants[1].id);
            expect(expenses.length).to.equal(2);
            expect(expenses).contains(sheet.expenses[0]);
            expect(expenses).contains(sheet.expenses[1]);
        });

        it('should find expenses the participant has paid', function () {
            const expenses = expensesService.findAllExpensesOfParticipant(participants[0].id);
            expect(expenses.length).to.equal(4);
        });

        it('should find expenses the participant has paid for or participated in', function () {
            const expenses = expensesService.findExpensesPaidByParticipant(participants[0].id);
            expect(expenses.length).to.equal(2);
            expect(expenses).contains(sheet.expenses[0]);
            expect(expenses).contains(sheet.expenses[3]);
        });

        it('should calculate participant\'s share of the total sum', function () {
            expect(expensesService.calculateParticipantShare(participants[1].id)).to.equal(1.5);
        });

        it('should calculate total sum paid by a participant', function () {
            expect(expensesService.calculateParticipantTotalPaid(participants[1].id)).to.equal(5);
        });

        it('should calculate participant\'s balance (share - total paid)', function () {
            expect(expensesService.calculateParticipantBalance(participants[1].id)).to.equal(-3.5);
        });
    });

    describe('Calculating balances', function () {
        const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' }, { id:'3', name:'John' } ];

        it('should calculate balances from given expenses', function () {
            const sheet = {
                participants,
                expenses: [
                    {
                        name: 'expense1',
                        price: 240,
                        participants: participants.map(p => p.id),
                        payer: participants[1].id
                    },
                    {
                        name: 'expense2',
                        price: 75,
                        participants: participants.map(p => p.id),
                        payer: participants[2].id
                    }
                ]
            };

            const res = new ExpensesService(sheet).calculateBalances();

            expect(res).to.contain({ participant: '1', balance: 105 });
            expect(res).to.contain({ participant: '2', balance: -135 });
            expect(res).to.contain({ participant: '3', balance: 30 });
        });

        it('should sort balances by price', function () {
            const sheet = {
                participants,
                expenses: [
                    {
                        name: 'expense1',
                        price: 240,
                        participants: participants.map(p => p.id),
                        payer: participants[1].id
                    },
                    {
                        name: 'expense2',
                        price: 75,
                        participants: participants.map(p => p.id),
                        payer: participants[2].id
                    }
                ]
            };

            const res = new ExpensesService(sheet).calculateBalances();

            expect(res[0].balance).to.equal(-135);
            expect(res[1].balance).to.equal(30);
            expect(res[2].balance).to.equal(105);
        });

        it('participant\'s balance should be 0 if not participated in any expenses', function () {
            const sheet = {
                participants,
                expenses: [
                    {
                        name: 'expense1',
                        price: 100,
                        participants: ['1', '2'],
                        payer: participants[0].id
                    },
                    {
                        name: 'expense2',
                        price: 100,
                        participants: ['1', '2'],
                        payer: participants[0].id
                    }
                ]
            };

            const service = new ExpensesService(sheet);

            expect(service.calculateBalances()).to.deep.equal([
                { participant: '1', balance: -100 },
                { participant: '3', balance: 0 },
                { participant: '2', balance: 100 }
            ]);
        });
    });

});
