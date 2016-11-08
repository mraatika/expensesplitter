import {expect} from 'chai';
import factory from 'client/factory/expensefactory';

describe('Factory: ExpenseFactory', function () {
    describe('create', function () {
        describe('defaults', function () {
            it('should have an id', function () {
                expect(factory().id).to.be.a('string');
            });

            it('should have empty string as name', function () {
                expect(factory().name).to.be.a('string');
                expect(factory().name).to.have.lengthOf(0);
            });

            it('should have null as price', function () {
                expect(factory().price).to.be.null;
            });

            it('should have an empty array as participants', function () {
                expect(factory().participants).to.be.an('array');
                expect(factory().participants).to.have.lengthOf(0);
            });

            it('should have null as payer', function () {
                expect(factory().payer).to.be.null;
            });
        });

        describe('given props', function () {
            it('should always create new id', function () {
                const id = '1';
                expect(factory({ id }).id).not.to.equal(id);
            });

            it('should have given name', function () {
                const name = 'expense';
                expect(factory({ name }).name).to.equal(name);
            });

            it('should have given price', function () {
                const price = 0;
                expect(factory({ price }).price).to.equal(price);
            });

            it('should have given participant array', function () {
                const participants = ['Mike'];
                expect(factory({ participants }).participants).to.equal(participants);
            });

            it('should have given payer', function () {
                const payer = '1';
                expect(factory({ payer }).payer).to.equal(payer);
            });
        });
    });
});