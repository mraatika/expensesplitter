import {expect} from 'chai';
import {Promise} from 'kew';
import {connection} from 'server/database/dbconnector';
import sinon from 'sinon';
import {authenticate, resetAuthorization} from 'server/database/dbauthorization';

describe('Authorization', function () {
    let authStub;

    beforeEach(() => { authStub = sinon.stub(connection, 'auth');  resetAuthorization(); });
    afterEach(() => connection.auth.restore());

    it('should return a promise', function () {
        expect(authenticate()).to.be.instanceof(Promise);
    });

    it('should reject the promise if username is not provided', function (done) {
        authenticate()
            .fail(msg => {
                try {
                    expect(msg).to.contain('Username missing or invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject the promise if username is not a string', function (done) {
        authenticate(1)
            .fail(msg => {
                try {
                    expect(msg).to.contain('Username missing or invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject the promise if password is not provided', function (done) {
        authenticate('username')
            .fail(msg => {
                try {
                    expect(msg).to.contain('Password missing or invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should reject the promise if username is not a string', function (done) {
        authenticate('username', 1)
            .fail(msg => {
                try {
                    expect(msg).to.contain('Password missing or invalid');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should call _session db with given username and password', function (done) {
        authStub
            .callsArgWith(2, undefined, {}, {});

        authenticate('username', 'password')
            .then(() => {
                try {
                    expect(authStub).to.have.been.calledWith('username', 'password');
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should resolve promise with body and headers if auth succeeds', function (done) {
        const headers = { 'set-cookie': ['AuthSession=123'] };

        authStub
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
        authStub
            .callsArgWith(2, new Error(), {}, {});

        authenticate('username', 'password')
            .fail(err => {
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

        authStub
            .callsArgWith(2, null, {}, headers);

        authenticate('username', 'password')
            .then(() => {
                authenticate('username', 'password')
                    .then(() => {
                        try {
                            expect(authStub).to.have.been.calledOnce;
                            done();
                        } catch(e) {
                            done(e);
                        }
                    });
            });
    });
});