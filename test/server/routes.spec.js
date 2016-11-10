import chai, {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const SheetServiceMock = function() {};

SheetServiceMock.prototype = {
    get: sinon.stub(),
    add: sinon.stub(),
    update: sinon.stub(),
    delete: sinon.stub()
};

describe('Routes', () => {
    let server;

    proxyquire.noCallThru();
    proxyquire.noPreserveCache();

    before((done) => {
        const routes = proxyquire('server/routes', {
            'server/service/sheetservice': SheetServiceMock
        }).default;

        const authorizationMiddleware = proxyquire('server/middleware/authorizationmiddleware', {
            'server/database/dbauthorization': {
                authenticate: () => Promise.resolve()
            }
        }).default;

        const app = proxyquire('server/server', {
            'server/middleware/authorizationmiddleware': authorizationMiddleware,
            'server/routes': routes
        }).default;

        server = app.start();

        done();
    });

    after(() => server.close());

    afterEach(() => {
        ['get', 'add', 'update', 'delete'].forEach(k => SheetServiceMock.prototype[k].reset());
    });

    describe('Fetching', () => {
        beforeEach(() => {
            // response configuration
            SheetServiceMock.prototype.get
                .withArgs('1')
                    .resolves({ id: '1' })
                .withArgs('2')
                    .rejects({ statusCode: 404 })
                .withArgs('3')
                    .rejects({ statusCode: 500 });
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
            SheetServiceMock.prototype
                .add
                .withArgs(okSheet)
                .resolves(okSheet)
                .withArgs(failSheet)
                .rejects({ statusCode: 422 });
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
            SheetServiceMock.prototype
                .get
                .withArgs('1')
                .resolves(okSheet);
            SheetServiceMock.prototype
                .update
                .resolves(okSheet);
        });

        describe('an existing sheet', () => {

            it('should call update and return 200', (done) => {

                chai.request(server)
                    .put('/sheet/1')
                    .send({ sheet: okSheet })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.statusCode).to.equal(200);
                        expect(SheetServiceMock.prototype.update).to.have.been.calledWith(okSheet);
                        done();
                    });
            });
        });

        describe('a non existing sheet', function () {

            it('should return a 404 error', (done) => {
                SheetServiceMock.prototype
                    .get
                    .rejects({ statusCode: 404 });

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

                SheetServiceMock.prototype
                    .get
                    .withArgs('2')
                    .resolves({ id:'2' });
                SheetServiceMock.prototype
                    .update
                    .rejects({ statusCode: 400 });

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

        describe('a sheet that exists', () => {

            it('should return 200 ok', (done) => {
                const adminKey = '123';

                SheetServiceMock.prototype
                    .get
                    .withArgs('1')
                    .resolves({ id: '1', adminKey });
                SheetServiceMock.prototype
                    .delete
                    .resolves();

                chai.request(server)
                    .delete('/sheet/1')
                    .set('X-Admin-Token', adminKey)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.statusCode).to.equal(200);
                        expect(SheetServiceMock.prototype.get.called).to.be.true;
                        expect(SheetServiceMock.prototype.get.calledWith('1')).to.be.true;
                        done();
                    });
            });
        });

        describe('a non existing sheet', () => {

            it('should return 404 when sheet is not found', (done) => {

                SheetServiceMock.prototype
                    .get
                    .withArgs('2')
                    .rejects({ statusCode: 404 });

                chai.request(server)
                    .delete('/sheet/2')
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
            });
        });

        describe('and failing', function () {
            const adminKey = '123';

            beforeEach(function () {
                SheetServiceMock.prototype.get
                    .withArgs('1')
                    .resolves({ id: '1', adminKey });
            });

            it('should return an error when delete fails', (done) => {
                const adminKey = '123';

                SheetServiceMock.prototype
                    .get
                    .resolves({ id: '1', adminKey });
                SheetServiceMock.prototype
                    .delete
                    .rejects({ statusCode: 500 });

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

