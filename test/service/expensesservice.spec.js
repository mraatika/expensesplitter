import {expect} from 'chai';
import ExpensesService from '../../src/js/service/expensesservice';

/**
 * @TODO: needs more tests
 */

describe('Service: ExpensesService', function () {

    let expensesService;
    const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' } ];
    const sheet = {
        participants: participants,
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

    beforeEach(function () {
        expensesService = new ExpensesService(sheet);
    });

    it('should count total sum of expenses', function () {
        const total = sheet.expenses.reduce((memo, expense) => memo + expense.price, 0);
        expect(expensesService.getTotalSum()).to.equal(total);
    });

    it('should return expenses where given participant is participant', function () {
        const expensesForParticipant2 = expensesService.findExpensesByParticipant(participants[1].id);
        expect(expensesForParticipant2.length).to.equal(2);
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

    describe('Calculating balances', function () {
        const participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' }, { id:'3', name:'John' } ];

        it('should calculate balances from given expenses', function () {
            const sheet = {
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
            expect(expensesService.calculateBalances(sheet.expenses, participants)).to.deep.equal([
                { participant: '2', balance: -135 },
                { participant: '3', balance: 30 },
                { participant: '1', balance: 105 }
            ]);
        });

        it('participant\'s balance should be 0 if not participated in any expenses', function () {
            const sheet = {
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
            expect(expensesService.calculateBalances(sheet.expenses, participants)).to.deep.equal([
                { participant: '1', balance: -100 },
                { participant: '3', balance: 0 },
                { participant: '2', balance: 100 }
            ]);
        });
    });

});
