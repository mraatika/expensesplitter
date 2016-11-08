import {expect} from 'chai';
import factory from 'client/factory/participantfactory';

describe('Factory: ParticipantFactory', function () {
    describe('create', function () {
        describe('defaults', function () {
            it('should have an id', function () {
                expect(factory().id).to.be.a('string');
            });

            it('should have empty string as name', function () {
                expect(factory().name).to.be.a('string');
                expect(factory().name).to.have.lengthOf(0);
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

            it('should trim the given name', function () {
                const name = ' expense ';
                expect(factory({ name }).name).to.equal(name.trim());
            });
        });
    });
});