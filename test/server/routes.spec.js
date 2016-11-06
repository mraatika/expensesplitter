import chai, {expect} from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
//import {test as serverConf} from 'server/conf/server.conf.json';
import sheetService from 'server/service/sheetservice.js';
import Q from 'kew';
import app from 'server/server';

chai.use(chaiHttp);

describe.only('Routes', () => {
    let server;

    before((done) => {
        server = app.start();
        done();
    });

    describe('Fetching', () => {
        beforeEach(() => {

            // response configuration
            sinon.stub(sheetService, 'get')
                .withArgs('1').returns(Q.resolve({ id: '1' }))
                .withArgs('2').returns(Q.reject({ statusCode: 404 }))
                .withArgs('3').returns(Q.reject({ statusCode: 500 }));
        });

        afterEach(() => {
            sheetService.get.restore();
        });

        describe('an non existing page', () => {
            it('should return a 404 response', (done) => {
                chai.request(server)
                    .get('/nonexisting/2')
                    .end((err, res) => {
                        expect(err).not.to.be.undefined;
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
            });
        });

        describe('a sheet with a valid id', () => {

            it('should return a 200 response', (done) => {
                chai.request(server)
                    .get('/sheet/1')
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.sheet.id).to.equal('1');
                        done();
                    });
            });
        });

        describe('a sheet with an invalid id', () => {

            it('should return a 404 response', (done) => {
                chai.request(server)
                    .get('/sheet/2')
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
            });
        });

        describe('a sheet that causes an internal server error', () => {

            it('should return a 500 response', (done) => {
                chai.request(server)
                    .get('/sheet/3')
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(500);
                        done();
                    });
            });
        });
    });

    describe('Creating', () => {
        const okSheet = { a: 1, _rev: '1-1', id: 1 };
        const failSheet = { a: 2, _rev: '2-1', id: 2 };

        beforeEach(() => {
            sinon.stub(sheetService, 'add')
                .withArgs(okSheet).returns(Q.resolve(okSheet))
                .withArgs(failSheet).returns(Q.reject({ statusCode: 422 }));
        });

        afterEach(() => {
            sheetService.add.restore();
        });

        describe('and succeeding', () => {

            it('should return 200 if ok', (done) => {
                chai.request(server)
                    .post('/sheet')
                    .send({ sheet: okSheet })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
            });
        });

        describe('an invalid sheet', function () {

            it('should return a 422 error', (done) => {
                chai.request(server)
                    .post('/sheet')
                    .send({ sheet: failSheet })
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(422);
                        done();
                    });
            });
        });
    });

    describe('Updating', () => {
        const okSheet = { a: 1, _rev: '1-1', id: 1 };
        const failSheet = { a: 2, _rev: '2-1', id: 2 };

        beforeEach(() => {
            sinon.stub(sheetService, 'get').returns(Q.resolve(okSheet));
            sinon.stub(sheetService, 'update').returns(Q.resolve(okSheet));
        });

        afterEach(() => {
            sheetService.get.restore();
            sheetService.update.restore();
        });

        describe('an existing sheet', () => {

            it('should call update and return 200', (done) => {

                chai.request(server)
                    .put('/sheet/1')
                    .send({ sheet: okSheet })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.statusCode).to.equal(200);
                        expect(sheetService.update.calledWith(okSheet)).to.be.true;
                        done();
                    });
            });
        });

        describe('a non existing sheet', function () {

            it('should return a 404 error', (done) => {
                sheetService.get.returns(Q.reject({ statusCode: 404 }));

                chai.request(server)
                    .put('/sheet/2')
                    .send({ sheet: failSheet })
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
            });
        });

        describe('a non valid sheet', function () {

            it('should return a 400 error', (done) => {
                sheetService.update.returns(Q.reject({ statusCode: 400 }));

                chai.request(server)
                    .put('/sheet/2')
                    .send({ sheet: failSheet })
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(400);
                        done();
                    });
            });
        });
    });

    describe('Deleting ', () => {

        beforeEach(() => {
            sinon.stub(sheetService, 'get');
            sinon.stub(sheetService, 'delete');
        });

        afterEach(() => {
            sheetService.get.restore();
            sheetService.delete.restore();
        });

        describe('a sheet that exists', () => {

            it('should return 200 ok', (done) => {
                const adminKey = '123';
                sheetService.get.returns(Q.resolve({ id: '1', adminKey }));
                sheetService.delete.returns(Q.resolve());

                chai.request(server)
                    .delete('/sheet/1')
                    .set('X-Admin-Token', adminKey)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.statusCode).to.equal(200);
                        expect(sheetService.get.called).to.be.true;
                        expect(sheetService.get.calledWith('1')).to.be.true;
                        done();
                    });
            });
        });

        describe('a non existing sheet', () => {

            it('should return 404 when sheet is not found', (done) => {
                sheetService.get.returns(Q.reject({ statusCode: 404 }));

                chai.request(server)
                    .delete('/sheet/1')
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
            });
        });

        describe('and failing', function () {
            const adminKey = '123';

            beforeEach(function () {
                sheetService.get.returns(Q.resolve({ id: '1', adminKey }));
            });

            it('should return an error when delete fails', (done) => {
                const adminKey = '123';
                sheetService.get.returns(Q.resolve({ id: '1', adminKey }));
                sheetService.delete.returns(Q.reject({ statusCode: 500 }));

                chai.request(server)
                    .delete('/sheet/1')
                    .set('X-Admin-Token', adminKey)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(500);
                        done();
                    });
            });

            it('should return a 403 error if admin keys dont\'t match', function (done) {
                chai.request(server)
                    .delete('/sheet/1')
                    .set('X-Admin-Token', 'invalidkey')
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(403);
                        done();
                    });
            });

            it('should return a 403 error if admin key is missing', function (done) {
                chai.request(server)
                    .delete('/sheet/1')
                    .end((err, res) => {
                        expect(err).not.to.be.null;
                        expect(res.statusCode).to.equal(403);
                        done();
                    });
            });
        });
    });
});

