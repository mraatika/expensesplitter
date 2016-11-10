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
    const {protocol, username, password, host, port, db_name} = config;
    const scope = nock(`${protocol}${username}:${password}@${host}:${port}`);

    before(function () {
        sheetService = proxyquire('server/service/sheetservice', {
            'common/validation/sheetvalidator': validationStub
        }).default;
    });

    describe('GET:', function () {
        it('should get an existing entry from the db', function (done) {
            const response = { _id: '1', id: '1', _rev: '1-1' };

            scope
                .get(`/${db_name}/${response.id}`)
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

            scope
                .get(`/${db_name}/${id}`)
                .reply(404);

            sheetService.get(id)
                .catch(err => {
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

            scope
                .put(`/${db_name}/${entry.id}`)
                .reply(200);

            scope
                .get(`/${db_name}/${entry.id}`)
                .reply(200, response);

            sheetService.add(entry)
                .then(val => {
                    try {
                        expect(val.id).to.equal(response.id);
                        expect(val._id).to.equal(response._id);
                        done();
                    } catch (e) { done(e); }
                })
                .catch(e => console.log(e));
        });

        it('should reject the promise if request fails', function (done) {
            const entry = { id: '1' };

            validationStub.validate.returns({});

            scope
                .put(`/${db_name}/${entry.id}`)
                .reply(500);

            sheetService.add(entry)
                .catch(err => {
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
                .catch(err => {
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

            validationStub.validate.returns({});

            scope
                .get(`/${db_name}/${original.id}`)
                .reply(200, original);

            scope
                .post(`/${db_name}`)
                .reply(200, updated);

            sheetService.update(updated)
                .then(val => {
                    try {
                        expect(val.id).to.equal(updated.id);
                        expect(val.prop).to.equal(updated.prop);
                        expect(val._rev).to.equal(original._rev);
                        done();
                    } catch (e) { done(e); }
                });
        });

        it('should reject the promise in case of error', function (done) {
            const original = { _id: '1', id: '1', _rev: '1-1', prop: 1 };

            validationStub.validate.returns({});

            scope
                .get(`/${db_name}/${original.id}`)
                .reply(200, original);

            scope
                .post(`/${db_name}`)
                .reply(500);

            sheetService.update(original)
                .catch(err => {
                    try {
                        expect(err.statusCode).to.equal(500);
                        done();
                    } catch (e) { done(e); }
                });
        });

        it('should override the existing enrty in case of conflict', function (done) {
            const dbentry = { _id: '1', id: '1', _rev: '1-2', prop: 1 };
            const entryupdate = { _id: '1', id: '1', _rev: '1-1', prop: 2 };

            validationStub.validate.returns({});

            // first get returns the original document
            scope
                .get(`/${db_name}/${dbentry.id}`)
                .reply(200, dbentry);

            // second insert is fine
            scope
                .post(`/${db_name}`)
                .reply(200, entryupdate);

            sheetService.update(entryupdate)
                .then(val => {
                    try {
                        expect(val.prop).to.equal(entryupdate.prop);
                        done();
                    } catch (e) { done(e); }
                })
                .catch(err => done(err));
        });
    });

    describe('DELETE:', function () {

        it('should resolve the promise when succeeded', function (done) {

            scope
                .delete(`/${db_name}`)
                .reply(200);

            sheetService.delete('1')
                .then(done);
        });

        it('should reject the promise when the request fails', function (done) {

            scope
                .delete(`/${db_name}`)
                .reply(500);

            sheetService.delete('1')
                .catch(err => {
                    try {
                        expect(err.statusCode).to.equal(500);
                        done();
                    } catch(e) { done(e); }
                });
        });
    });
});