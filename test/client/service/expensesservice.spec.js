import {expect} from 'chai';
import * as service from 'service/expensesservice';

describe('Service: ExpensesService', function () {
    const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' } ];

    describe('Calculating total sum of expenses', function () {
        it('should count sum of all expenses', function () {
            const expenses = [
                {
                    name: 'expense1',
                    price: 1
                },
                {
                    name: 'expense2',
                    price: 2
                },
                {
                    name: 'expense3',
                    price: 3
                }
            ];
            const total = expenses.reduce((sum, expense) => sum + expense.price, 0);
            expect(service.getTotalSum(expenses)).to.equal(total);
        });

        it('should convert strings to numeric', function () {
            const expenses = [
                {
                    name: 'expense1',
                    price: 1
                },
                {
                    name: 'expense2',
                    price: '2'
                }
            ];

            expect(service.getTotalSum(expenses)).to.equal(3);
        });

        it('should convert NaN to 0', function () {
            const expenses = [
                {
                    name: 'expense1',
                    price: 1
                },
                {
                    name: 'expense2',
                    price: 'abc'
                }
            ];

            expect(service.getTotalSum(expenses)).to.equal(1);
        });
    });

    describe('Calculating participant shares', function () {
        const expenses = [
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
        ];

        it('should find expenses if the participant is participated in', function () {
            const filtered = service.findExpensesByParticipant(expenses)(participants[1].id);
            expect(filtered.length).to.equal(2);
            expect(filtered).contains(expenses[0]);
            expect(filtered).contains(expenses[1]);
        });

        it('should find expenses the participant has paid', function () {
            const filtered = service.findExpensesPaidByParticipant(expenses)(participants[0].id);
            expect(filtered.length).to.equal(2);
            expect(filtered).contains(expenses[0]);
            expect(filtered).contains(expenses[3]);
        });

        it('should find expenses the participant has paid for or participated in', function () {
            const filtered = service.findAllExpensesOfParticipant(expenses)(participants[0].id);
            expect(filtered.length).to.equal(4);
        });

        it('should exclude expenses the participant hasn\'t paid for or participated in', function () {
            const expense = { name: 'price5', price: 5, participants: ['3'], payer: '3'};
            const data = expenses.concat(expense);
            const filtered = service.findAllExpensesOfParticipant(data)(participants[0].id);
            expect(filtered.length).to.equal(4);
        });
    });

    describe('Calculating participant shares', function () {

        const expenses = [
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
        ];

        it('should sum prices of the expenses participant has participated in', function () {
            const result = service.calculateParticipantShare(expenses)(participants[1].id);
            expect(result).to.equal(1.5);
        });
    });

    describe('Calculating sum of expenses paid by a participant', function() {

        it('should sum prices of the expenses paid by', function () {
            const expenses = [
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
                }
            ];

            const payer = participants[1].id;

            expect(service.calculateParticipantTotalPaid(expenses)(payer)).to.equal(5);
        });
    });

    describe('Calculating balances', function () {
        const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' }, { id:'3', name:'John' } ];

        it('should calculate balance of a single participant', function () {
            const expenses = [
                {
                    name: 'expense1',
                    price: 6,
                    participants: participants.map(p => p.id),
                    payer: participants[0].id
                },
                {
                    name: 'expense2',
                    price: 2,
                    participants: participants.map(p => p.id),
                    payer: participants[1].id
                }
            ];

            const result = service.calculateParticipantBalance(participants[0].id, expenses);

            expect(result).to.equal(8 / 3 - 6);
        });

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

            const res = service.calculateBalances(sheet);

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

            const res = service.calculateBalances(sheet);

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

            expect(service.calculateBalances(sheet)).to.deep.equal([
                { participant: '1', balance: -100 },
                { participant: '3', balance: 0 },
                { participant: '2', balance: 100 }
            ]);
        });
    });

    it('should return all balances and shares as an array of objects', function () {
        const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' }, { id: '3', name: 'Make' }, { id: '4', name: 'Aapeli' }];
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
                    price: 40,
                    participants: participants.map(p => p.id),
                    payer: participants[2].id
                }
            ]
        };

        const expected = [
            { participantId: participants[1].id, participantName: participants[1].name, balance: -170, amount: 70 },
            { participantId: participants[2].id, participantName: participants[2].name, balance: 30, amount: 70 },
            { participantId: participants[3].id, participantName: participants[3].name, balance: 70, amount: 70 },
            { participantId: participants[0].id, participantName: participants[0].name, balance: 70, amount: 70 }
        ];

        expect(service.getAllBalancesAndShares(sheet)).to.deep.equal(expected);
    });

});
