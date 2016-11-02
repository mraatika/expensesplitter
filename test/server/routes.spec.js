import restify from 'restify';
import {expect} from 'chai';
import sinon from 'sinon';
import {test as serverConf} from 'server/conf/server.conf.json';
import sheetService from 'server/service/sheetservice.js';
import Q from 'kew';
import server from 'server/server';

// init the test client
const client = restify.createJsonClient({
    version: '*',
    url: serverConf.url + ':' + serverConf.port
});

describe('Routes', () => {

    before(done => {
        server.start();
        done();
    });

    describe('GET', () => {
        beforeEach(() => {

            // response configuration
            sinon.stub(sheetService, 'get')
                .withArgs('1').returns(Q.resolve({ id: '1' }))
                .withArgs('2').returns(Q.reject(new restify.NotFoundError()))
                .withArgs('3').returns(Q.reject(new restify.InternalServerError()));
        });

        afterEach(() => {
            sheetService.get.restore();
        });

        describe('Getting an non existing page', () => {
            it('should return a 404 response', done => {
                client.get('/nonexisting/2', (err, req, res) => {
                    expect(err).not.to.be.null;
                    expect(err.body.code).to.equal('ResourceNotFound');
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });
        });

        describe('Getting a sheet with a valid id', () => {

            it('should return a 200 response', done => {
                client.get('/sheet/1', (err, req, res, data) => {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(data.sheet.id).to.equal('1');
                    done();
                });
            });
        });

        describe('Getting a sheet with an invalid id', () => {

            it('should return a 404 response', done => {
                client.get('/sheet/2', (err, req, res) => {
                    expect(err).not.to.be.null;
                    expect(err.body.code).to.equal('ResourceNotFound');
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });
        });

        describe('Getting a sheet that causes an internal server error', () => {

            it('should return a 500 response', done => {
                client.get('/sheet/3', (err, req, res) => {
                    expect(err).not.to.be.null;
                    expect(err.body.code).to.equal('InternalServerError');
                    expect(res.statusCode).to.equal(500);
                    done();
                });
            });
        });
    });

    describe('POST', () => {
        const okSheet = { a: 1, _rev: '1-1', id: 1 };
        const failSheet = { a: 2, _rev: '2-1', id: 2 };

        describe('Posting new resource', () => {

            beforeEach(() => {
                sinon.stub(sheetService, 'add')
                    .withArgs(okSheet).returns(Q.resolve(okSheet))
                    .withArgs(failSheet).returns(Q.reject(new restify.BadRequestError()));
            });

            afterEach(() => {
                sheetService.add.restore();
            });

            it('should return 200 if ok', done => {

                client.post('/sheet', { sheet:okSheet }, (err, req, res) => {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });

            it('should return 400 if invalid sheet', done => {

                client.post('/sheet', { sheet: failSheet }, (err, req, res) => {
                    expect(err).not.to.be.null;
                    expect(err.body.code).to.equal('BadRequestError');
                    expect(res.statusCode).to.equal(400);
                    done();
                });
            });
        });
    });

    describe('PUT', () => {
        const okSheet = { a: 1, _rev: '1-1', id: 1 };
        const failSheet = { a: 2, _rev: '2-1', id: 2 };

        describe('Updating an existing sheet', () => {

            beforeEach(() => {
                sinon.stub(sheetService, 'get').returns(Q.resolve(okSheet));
                sinon.stub(sheetService, 'update').returns(Q.resolve(okSheet));
            });

            afterEach(() => {
                sheetService.get.restore();
                sheetService.update.restore();
            });

            it('should call update and return 200', done => {
                client.put('/sheet/1', { sheet: okSheet }, (err, req, res) => {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(sheetService.update.calledWith(okSheet)).to.be.true;
                    done();
                });
            });

            it('should return 404 if sheet is not found', done => {
                sheetService.get.returns(Q.reject(new restify.ResourceNotFoundError()));

                client.put('/sheet/2', { sheet: failSheet }, (err, req, res) => {
                    expect(err).not.to.be.null;
                    expect(err.body.code).to.equal('ResourceNotFound');
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });

            it('should return 400 if update fails', done => {
                sheetService.update.returns(Q.reject(new restify.BadRequestError()));

                client.put('/sheet/3', {sheet: { _id: '3', a: 3 }}, (err, req, res) => {
                    expect(err).not.to.be.null;
                    expect(err.body.code).to.equal('BadRequestError');
                    expect(res.statusCode).to.equal(400);
                    done();
                });
            });
        });
    });

    describe('DELETE ', () => {

        beforeEach(() => {
            sinon.stub(sheetService, 'get');
            sinon.stub(sheetService, 'delete');
        });

        afterEach(() => {
            sheetService.get.restore();
            sheetService.delete.restore();
        });

        describe('Successfull delete', () => {

            beforeEach(() => {
                sheetService.get.returns(Q.resolve({ id: 1 }));
                sheetService.delete.returns(Q.resolve({}));
            });

            it('should return 200 ok', done => {

                client.del('/sheet/1', (err, req, res) => {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(sheetService.get.called).to.be.true;
                    expect(sheetService.get.calledWith('1')).to.be.true;
                    done();
                });
            });

            it('should call the service\'s delete method', done => {
                client.del('/sheet/1', () => {
                    expect(sheetService.delete.called).to.be.true;
                    done();
                });
            });
        });

        describe('Errors while deleting a sheet', () => {

            it('should return 404 when sheet is not found', done => {
                sheetService.get.returns(Q.reject(new restify.ResourceNotFoundError()));

                client.del('/sheet/1', (err, req, res) => {
                    expect(err.body.code).to.equal('ResourceNotFound');
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });

            it('should return 404 when get fails', done => {
                sheetService.get.returns(Q.reject(new restify.ResourceNotFoundError()));

                client.del('/sheet/1', (err, req, res) => {
                    expect(err.body.code).to.equal('ResourceNotFound');
                    expect(res.statusCode).to.equal(404);
                    done();
                });
            });

            it('should return 500 when delete fails', done => {
                sheetService.get.returns(Q.resolve({ id: '1' }));
                sheetService.delete.returns(Q.reject(new restify.InternalServerError()));

                client.del('/sheet/1', (err, req, res) => {
                    expect(err.body.code).to.equal('InternalServerError');
                    expect(res.statusCode).to.equal(500);
                    done();
                });
            });
        });
    });
});

