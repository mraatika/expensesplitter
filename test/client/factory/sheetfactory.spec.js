import {expect} from 'chai';
import {t} from 'common/dictionary/dictionary';
import factory from 'client/factory/sheetfactory';

describe('Factory: SheetFactory', function () {
    describe('create', function () {
        describe('defaults', function () {

            it('should have empty string as additionalInformation', function () {
                expect(factory().additionalInformation).to.be.a('string');
                expect(factory().additionalInformation).to.be.empty;
            });

            it('should have an adminKey', function () {
                expect(factory().adminKey).to.be.a('string');
                expect(factory().adminKey).not.to.be.empty;
            });

            it('should have creation date', function () {
                expect(factory().createdOn).to.be.a('date');
            });

            it('should have an empty array as expenses', function () {
                expect(factory().expenses).to.be.an('array');
                expect(factory().expenses).to.be.empty;
            });

            it('should have an id', function () {
                expect(factory().id).to.be.a('string');
            });

            it('should have null as latest save date', function () {
                expect(factory().lastSavedOn).to.be.null;
            });

            it('should have empty string as name', function () {
                expect(factory().name).to.be.a('string');
                expect(factory().name).to.be.empty;
            });

            it('should have an empty array as participants', function () {
                expect(factory().participants).to.be.an('array');
                expect(factory().participants).to.be.empty;
            });

            it('should have settings object', function () {
                expect(factory().settings).to.be.an('object');
            });

            it('should have default currencySymbol in settings', function () {
                expect(factory().settings.currencySymbol).to.equal(t('app.locales.currency_symbol'));
            });
        });

        describe('given props', function () {

            it('should have given name', function () {
                const name = 'testsheet';
                expect(factory({ name }).name).to.equal(name);
            });

            it('should trim the given name', function () {
                const name = ' testsheet ';
                expect(factory({ name }).name).to.equal(name.trim());
            });

            it('should extend settings with given props', function () {
                const settings = { setting1: 1 };
                expect(factory({ settings }).settings.setting1).to.equal(settings.setting1);
            });

            it('should replace default currencySymbol with given', function () {
                const settings = { currencySymbol: '€' };
                expect(factory({ settings }).settings.currencySymbol).to.equal(settings.currencySymbol);
            });
        });
    });
});