import {expect} from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import {test as config} from 'server/conf/db.conf.json';

const proxyquire = require('proxyquire');
// stub validation.validate
const validationStub = { validate: sinon.stub() };
let sheetService;

describe('SheetService', () => {
    // nock http interceptors
    const scope = nock(`${config.url}:${config.port}`);
    const idlessUrl = new RegExp(`/${config.db_name}`);
    const get = id => scope.get(new RegExp(`/${config.db_name}/${id}`));
    const create = () => scope.put(idlessUrl);
    const update = () => scope.post(idlessUrl);
    const del = () => scope.delete(idlessUrl);


    before(function () {
        sheetService = proxyquire('server/service/sheetservice', {
            'client/validation/validation': validationStub
        }).default;
    });

    describe('GET:', function () {
        it('should get an existing entry from the db', function (done) {
            const response = { _id: '1', id: '1', _rev: '1-1' };

            get(response.id)
                .reply(200, response);

            sheetService.get('1')
                .then(entry => {
                    try {
                        expect(entry.id).to.equal('1');
                        done();
                    } catch (e) { done(e); }
                });
        });

        it('should return a 404 error when querying for a nonexisting enty', function (done) {
            const id = '1';

            get(id)
                .reply(404);

            sheetService.get(id)
                .fail(err => {
                    try {
                        expect(err.statusCode).to.equal(404);
                        done();
                    } catch (e) { done(e); }
                });
        });
    });

    describe('CREATE:', function () {

        it('should add a entry to the database', function (done) {
            const entry = { id: '1' };
            const response = { id: '1', _id: '1'};

            validationStub.validate.returns({});

            create()
                .reply(200);

            get(entry.id)
                .reply(200, response);

            sheetService.add(entry)
                .then(val => {
                    try {
                        expect(val.id).to.equal(response.id);
                        expect(val._id).to.equal(response._id);
                        done();
                    } catch (e) { done(e); }
                })
                .fail(e => console.log(e));
        });

        it('should reject the promise if request fails', function (done) {
            const entry = { id: '1' };

            validationStub.validate.returns({});

            create()
                .reply(500);

            sheetService.add(entry)
                .fail(err => {
                    try {
                        expect(err.statusCode).to.equal(500);
                        done();
                    } catch (e) { done(e); }
                });
        });

        it('should reject the promise with status code 422 if sheet validation fails', function (done) {
            const entry = { id: '1' };

            validationStub.validate.returns({ name: true });

            sheetService.add(entry)
                .fail(err => {
                    try {
                        expect(err.statusCode).to.equal(422);
                        expect(err.message).not.to.be.undefined;
                        done();
                    } catch (e) { done(e); }
                });
        });
    });

    describe('UPDATE:', function () {

        it('should resolve promise with updated document when succeeded', function (done) {
            const original = { _id: '1', id: '1', _rev: '1-1', prop: 1 };
            const updated = { _id: '1', id: '1', _rev: '1-2', prop: 2 };


            update()
                .reply(200);

            get(original.id)
                .reply(200, updated);

            sheetService.update(updated)
                .then(val => {
                    try {
                        expect(val.id).to.equal(updated.id);
                        expect(val.prop).to.equal(updated.prop);
                        done();
                    } catch (e) { done(e); }
                });
        });

        it('should reject the promise in case of error', function (done) {
            const original = { _id: '1', id: '1', _rev: '1-1', prop: 1 };

            update()
                .reply(500);

            sheetService.update(original)
                .fail(err => {
                    try {
                        expect(err.statusCode).to.equal(500);
                        done();
                    } catch (e) { done(e); }
                });
        });

        it('should override the existing enrty in case of conflict', function (done) {
            const dbentry = { _id: '1', id: '1', _rev: '1-2', prop: 1 };
            const entryupdate = { _id: '1', id: '1', _rev: '1-1', prop: 2 };

            // first insert conflicts
            update()
                .reply(409);

            // first get returns the original document
            get(entryupdate.id)
                .reply(200, dbentry);

            // second insert is fine
            update()
                .reply(200);

            // second get returns the changed document
            get(dbentry.id)
                .reply(200, entryupdate);

            sheetService.update(entryupdate)
                .then(val => {
                    try {
                        expect(val.prop).to.equal(entryupdate.prop);
                        done();
                    } catch (e) { done(e); }
                });
        });
    });

    describe('DELETE:', function () {

        it('should resolve the promise when succeeded', function (done) {
            const spy = sinon.spy();

            del()
                .reply(200);

            sheetService.delete('1')
                .then(spy)
                .fin(() => {
                    try {
                        expect(spy.called).to.be.ok;
                        done();
                    } catch(e) { done(e); }
                });
        });

        it('should reject the promise when the request fails', function (done) {

            del('1')
                .reply(500);

            sheetService.delete('1')
                .fail(err => {
                    try {
                        expect(err.statusCode).to.equal(500);
                        done();
                    } catch(e) { done(e); }
                });
        });
    });
});