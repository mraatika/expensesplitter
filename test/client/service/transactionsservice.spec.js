import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

/**
 * @TODO: needs more tests
 */

describe('Service: TransactionsService', function () {

    proxyquire.noCallThru();
    proxyquire.noPreserveCache();

    let transactionsService;
    const calculateBalancesStub = sinon.stub();

    before(function () {
        const TransactionsService = proxyquire('service/transactionsservice', {
            'client/service/expensesservice': function() {
                return { calculateBalances: calculateBalancesStub };
            }
        }).default;

        transactionsService = new TransactionsService();
    });

    it('should calculate transactions', function() {
        calculateBalancesStub.returns([
            { participant: '2', balance: -135 },
            { participant: '3', balance: 30 },
            { participant: '1', balance: 105 }
        ]);

        const transactions = transactionsService.calculateTransactions();

        expect(transactions.length).to.equal(2);

        expect(transactions[0].from).to.equal('1');
        expect(transactions[0].to).to.equal('2');
        expect(transactions[0].amount).to.equal(105);

        expect(transactions[1].from).to.equal('3');
        expect(transactions[1].to).to.equal('2');
        expect(transactions[1].amount).to.equal(30);
    });

    it('should calculate transactions correctly when the a participant has zero balance', function () {
        calculateBalancesStub.returns([
            { participant: '1', balance: -50 },
            { participant: '2', balance: 0 },
            { participant: '3', balance: 50 }
        ]);

        const transactions = transactionsService.calculateTransactions();

        expect(transactions.length).to.equal(1);

        expect(transactions[0].from).to.equal('3');
        expect(transactions[0].to).to.equal('1');
        expect(transactions[0].amount).to.equal(50);
    });

    it('should not calculate any transactions if all balances are zero', function () {
        calculateBalancesStub.returns([
            { participant: '1', balance: 0 },
            { participant: '2', balance: 0 },
            { participant: '3', balance: 0 }
        ]);

        const transactions = transactionsService.calculateTransactions();

        expect(transactions.length).to.equal(0);
    });

    it('should break the loop if min and max participants are the same (float issue)', function () {
        calculateBalancesStub.returns([
            { participant: '1', balance: -50.00000000000001 },
            { participant: '3', balance: 50 }
        ]);

        const transactions = transactionsService.calculateTransactions();

        expect(transactions.length).to.equal(1);

        expect(transactions[0].from).to.equal('3');
        expect(transactions[0].to).to.equal('1');
        expect(transactions[0].amount).to.equal(50);
    });
});
