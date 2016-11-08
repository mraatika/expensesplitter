import {expect} from 'chai';
import factory from 'client/factory/sheethistoryfactory';

describe('Factory: SheetHistoryFactory', function () {
    describe('create', function () {
        const sheet = { id: '1', name: 'testsheet', createdOn: new Date(), 'omitted': true };

        it('should get id from given sheet', function () {
            expect(factory(sheet).id).to.equal(sheet.id);
        });

        it('should get name from given sheet', function () {
            expect(factory(sheet).name).to.equal(sheet.name);
        });

        it('should get creation date from given sheet', function () {
            expect(factory(sheet).createdOn).to.equal(sheet.createdOn);
        });

        it('should omit other props than previous three', function () {
            expect(factory(sheet).omitted).not.to.be.defined;
        });
    });
});