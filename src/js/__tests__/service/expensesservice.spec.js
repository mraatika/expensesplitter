'use strict';

jest.dontMock('../../service/expensesservice.js');

const ExpensesService = require('../../service/expensesservice');

describe('Service: ExpensesService', function () {

    var expensesService;
    var participants = [ { id:'1', name:'Keke' }, { id:'2', name:'Sepi' } ];
    var sheet = {
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
        var total = sheet.expenses.reduce((memo, expense) => memo + expense.price, 0);
        expect(expensesService.getTotalSum()).toEqual(total);
    });

    it('should return expenses where given participant is participant', function () {
        var expensesForParticipant2 = expensesService.findExpensesByParticipant(participants[1].id);
        expect(expensesForParticipant2.length).toEqual(2);
    });

    it('should calculate participant\'s share of the total sum', function () {
        expect(expensesService.calculateParticipantShare(participants[1].id)).toEqual(1.5);
    });

    it('should calculate total sum paid by a participant', function () {
        expect(expensesService.calculateParticipantTotalPaid(participants[1].id)).toEqual(5);
    });

    it('should calculate participant\'s balance (share - total paid)', function () {
        expect(expensesService.calculateParticipantBalance(participants[1].id)).toEqual(-3.5);
    });
});
