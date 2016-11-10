import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

proxyquire.noCallThru();
proxyquire.noPreserveCache();

describe('Authorization', function () {
    let authenticate, resetAuthorization;

    const connectionMock = {
        auth: sinon.stub()
    };

    before(() => {
        const dbauthorization = proxyquire('server/database/dbauthorization', {
            'server/database/dbconnector': {
                connect: () => connectionMock
            }
        });

        authenticate = dbauthorization.authenticate;
        resetAuthorization = dbauthorization.resetAuthorization;
    });

    beforeEach(() => { resetAuthorization(); });
    afterEach(() => { connectionMock.auth.reset(); });

    it('should return a promise', function () {
        const res = authenticate()
            // prevent logging a warning for unhandled promise rejection
            .catch(() => {});

        expect(res).to.be.instanceof(Promise);
    });

    it('should reject the promise if username is not provided', function (done) {
        authenticate()
            .catch(err => {
                try {
                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.contain('Username or password invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject the promise if username is not a string', function (done) {
        authenticate(1)
            .catch(err => {
                try {
                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.contain('Username or password invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject the promise if password is not provided', function (done) {
        authenticate('username')
            .catch(err => {
                try {
                    expect(err.message).to.contain('Username or password invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject the promise if username is not a string', function (done) {
        authenticate('username', 1)
            .catch(err => {
                try {
                    expect(err.message).to.contain('Username or password invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should call _session db with given username and password', function (done) {
        connectionMock.auth
            .callsArgWith(2, undefined, {}, {});

        authenticate('username', 'password')
            .then(() => {
                try {
                    expect(connectionMock.auth).to.have.been.calledWith('username', 'password');
                    done();
                } catch(e) {
                    done(e);
                }
            })
            .catch(err => console.log(err));
    });

    it('should resolve promise with body and headers if auth succeeds', function (done) {
        const headers = { 'set-cookie': ['AuthSession=123'] };

        connectionMock.auth
            .callsArgWith(2, null, {}, headers);

        authenticate('username', 'password')
            .then(res => {
                try {
                    expect(res).to.equal(headers['set-cookie']);
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject promise if auth fails', function (done) {
        connectionMock.auth
            .callsArgWith(2, new Error(), {}, {});

        authenticate('username', 'password')
            .catch(err => {
                try {
                    expect(err).to.be.instanceof(Error);
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should not call auth if already authenticated', function (done) {
        const headers = { 'set-cookie': ['AuthSession=123'] };

        connectionMock.auth
            .callsArgWith(2, null, {}, headers);

        authenticate('username', 'password')
            .then(() => {
                authenticate('username', 'password')
                    .then(() => {
                        try {
                            expect(connectionMock.auth).to.have.been.calledOnce;
                            done();
                        } catch(e) {
                            done(e);
                        }
                    });
            });
    });
});