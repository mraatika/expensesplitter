'use strict';

jest.autoMockOff();

const TransactionService = require('../../service/transactionsservice');

describe('Service: TransactionService', function () {

    var participants = [ { id:'1', name:'Seppo' }, { id:'2', name:'Markku' }, { 'id':3, name:'Pera' } ];

    it('should calculate transactions', function() {
        var sheet = {
            participants: participants,
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
        var transactionsService = new TransactionService(sheet);
        var transactions = transactionsService.calculateTransactions();

        expect(transactions.length).toEqual(2);

        expect(transactions[0].from).toEqual(participants[0].id);
        expect(transactions[0].to).toEqual(participants[1].id);
        expect(transactions[0].amount).toEqual(105);

        expect(transactions[1].from).toEqual(participants[2].id);
        expect(transactions[1].to).toEqual(participants[1].id);
        expect(transactions[1].amount).toEqual(30);
    });
});
