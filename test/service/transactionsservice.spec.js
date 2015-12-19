jest.autoMockOff();

const TransactionsService = require('../../service/transactionsservice').default;

describe('Service: TransactionsService', function () {

    const participants = [ { id:'1', name:'Seppo' }, { id:'2', name:'Markku' }, { 'id': '3', name:'Pera' } ];
    const initService = sheet => new TransactionsService(sheet);

    it('should calculate transactions', function() {
        const sheet = {
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
        const transactionsService = initService(sheet);
        const transactions = transactionsService.calculateTransactions(sheet.expenses, participants);

        expect(transactions.length).toEqual(2);

        expect(transactions[0].from).toEqual(participants[0].id);
        expect(transactions[0].to).toEqual(participants[1].id);
        expect(transactions[0].amount).toEqual(105);

        expect(transactions[1].from).toEqual(participants[2].id);
        expect(transactions[1].to).toEqual(participants[1].id);
        expect(transactions[1].amount).toEqual(30);
    });

    it('should calculate transactions correctly when the some participants are not participating in some expenses', function () {
        const sheet = {
            participants: participants,
            expenses: [
                {
                    name: 'Beer',
                    price: '66',
                    participants: ['1','2'],
                    payer: '1'
                },
                {
                    name: 'Food1',
                    price: '60',
                    participants: ['1','2','3'],
                    payer: '1'
                },
                {
                    name: 'Food2',
                    price: '80',
                    participants: ['2','3'],
                    payer: '2'
                },
                {
                    name: 'Gas',
                    price: '60',
                    participants: ['1','2','3'],
                    payer: '1'
                },
                {
                    name: 'Rockets',
                    price: '20',
                    participants: ['1','3'],
                    payer: '3'
                }
            ]
        };
        const transactionsService = initService(sheet);
        const transactions = transactionsService.calculateTransactions(sheet.expenses, participants);

        expect(transactions.length).toEqual(2);

        expect(transactions[0].from).toEqual(participants[2].id);
        expect(transactions[0].to).toEqual(participants[0].id);
        expect(transactions[0].amount).toEqual(70);

        expect(transactions[1].from).toEqual(participants[1].id);
        expect(transactions[1].to).toEqual(participants[0].id);
        expect(transactions[1].amount).toEqual(33);
    });

    it('should not calculate any transactions if all balances are zero', function () {
        const sheet = {
            participants: [participants[0], participants[1]],
            expenses: [
                {
                    name: 'expense1',
                    price: 20,
                    participants: ['1','2'],
                    payer: '1'
                },
                {
                    name: 'expense2',
                    price: 20,
                    participants: ['1','2'],
                    payer: '2'
                }
            ]
        };

        const transactionsService = initService(sheet);
        const transactions = transactionsService.calculateTransactions(sheet.expenses, participants);

        console.log(transactions);

        expect(transactions.length).toEqual(0);
    });
});
