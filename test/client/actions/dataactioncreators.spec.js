import {expect} from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from 'client/actions/dataactioncreators';
import Constants from 'client/constants/appconstants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Actions: DataActions', function () {

    describe('Sheet', function () {

        describe('create', function () {
            it('should throw if called without sheet', function () {
                expect(() => actions.createSheet()).to.throw();
            });

            it('should have type CREATE_SHEET', function () {
                const sheet = { name:'testsheet' };
                expect(actions.createSheet(sheet).type).to.equal(Constants.ActionTypes.CREATE_SHEET);
            });

            it('should have sheet as payload', function () {
                const sheet = { name:'testsheet' };
                expect(actions.createSheet(sheet).sheet).to.equal(sheet);
            });
        });

        describe('fetch', function () {
            it('should throw if called without sheet id', function () {
                expect(() => actions.fetchSheet()).to.throw();
            });

            it('should throw if called with invalid sheet id', function () {
                expect(() => actions.fetchSheet(1)).to.throw();
            });

            it('should dispatch an event', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: {}, settings });

                const res = actions.fetchSheet(sheet.id)(store.dispatch, store.getState);
                expect(res.type).to.equal(Constants.ActionTypes.LOAD_SHEET);
                expect(res.payload.request.url).to.contain(`sheet/${sheet.id}`);
                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });
        });

        describe('save', function () {
            it('should throw if called without a sheet', function () {
                expect(() => actions.saveSheet()).to.throw();
            });

            it('should throw if called with an invalid sheet', function () {
                expect(() => actions.saveSheet('a')).to.throw();
            });

            it('should return undefined if sheet is not changed (dirty)', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: { dirty: false }, settings });

                const res = actions.saveSheet(sheet)(store.dispatch, store.getState);
                expect(res).not.to.be.defined;
            });

            it('should return a post action when the sheet is not yet saved to the server', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: { dirty: true }, settings });

                const res = actions.saveSheet(sheet)(store.dispatch, store.getState);
                expect(res.type).to.equal(Constants.ActionTypes.SAVE_SHEET);
                expect(res.payload.request.method).to.equal('POST');
                expect(res.payload.request.url).to.equal('/sheet');
                expect(res.payload.request.data.sheet).to.equal(sheet);
                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });

            it('should return a put action when the sheet should be updated', function () {
                const sheet = { id: '1', name:'testsheet', settings: {}, lastSavedOn: new Date() };
                const store = mockStore({ sheet: { dirty: true }, settings: {} });

                const res = actions.saveSheet(sheet)(store.dispatch, store.getState);
                expect(res.type).to.equal(Constants.ActionTypes.SAVE_SHEET);
                expect(res.payload.request.method).to.equal('PUT');
                expect(res.payload.request.url).to.equal('/sheet/' + sheet.id);
                expect(res.payload.request.data.sheet).to.equal(sheet);
            });
        });

        describe('update', function () {
            const sheet = { id: '1', name:'testsheet', settings: {}, lastSavedOn: new Date() };

            it('should throw if called without a sheet', function () {
                expect(() => actions.updateSheet()).to.throw();
            });

            it('should throw if called with an invalid sheet', function () {
                expect(() => actions.updateSheet('a')).to.throw();
            });

            it('should return an action with sheet and an update object', function () {
                const update = { prop: 1 };
                const res = actions.updateSheet(sheet, update);

                expect(res.type).to.equal(Constants.ActionTypes.UPDATE_SHEET);
                expect(res.sheet).to.equal(sheet);
                expect(res.update).to.equal(update);
            });

            it('should update with empty object when second argument is undefined', function () {
                const res = actions.updateSheet(sheet);

                expect(res.update).to.be.an('object');
                expect(res.update).to.be.empty;
            });
        });

        describe('delete', function () {
            const sheet = { id: '1', adminKey: '123' };

            it('should throw if called without a sheet', function () {
                expect(() => actions.removeSheet()).to.throw();
            });

            it('should throw if called with an invalid sheet', function () {
                expect(() => actions.removeSheet('a')).to.throw();
            });

            it('should dispatch an error if adminKey is not provided', function () {
                const store = mockStore({ sheet: {}, settings: {} });

                const res = actions.removeSheet(sheet)(store.dispatch);
                expect(res.type).to.equal(Constants.ErrorEventTypes.REMOVE_SHEET);
                expect(res.error.client).to.be.ok;
                expect(res.error.message).to.be.a('string');
            });

            it('should dispatch an error if adminKey does not matche the sheet\'s adminKey', function () {
                const store = mockStore({ sheet: {}, settings: {} });

                const res = actions.removeSheet(sheet, 'invalidkey')(store.dispatch);
                expect(res.type).to.equal(Constants.ErrorEventTypes.REMOVE_SHEET);
                expect(res.error.client).to.be.ok;
                expect(res.error.message).to.be.a('string');
            });

            it('should dispatch a delete api action if adminKey matches the sheet\'s adminKey', function () {
                const store = mockStore({ sheet: {}, settings: { language: 'fi' } });

                const res = actions.removeSheet(sheet, sheet.adminKey)(store.dispatch, store.getState);
                expect(res.type).to.equal(Constants.ActionTypes.REMOVE_SHEET);
                expect(res.payload.request.method).to.equal('DELETE');
                expect(res.payload.request.url).to.equal(`/sheet/${sheet.id}`);
                expect(res.payload.request.headers['Accept-Language']).to.equal('fi');
                expect(res.payload.request.headers['X-Admin-Token']).to.equal(sheet.adminKey);
            });
        });
    });

    describe('Participant', function () {
        describe('add', function () {
            it('should throw if called without a participant', function () {
                expect(() => actions.addParticipant()).to.throw();
            });

            it('should throw if called with an invalid participant', function () {
                expect(() => actions.addParticipant('a')).to.throw();
            });

            it('should return an action with participant', function () {
                const participant = { id: 1 };
                const res = actions.addParticipant(participant);

                expect(res.type).to.equal(Constants.ActionTypes.ADD_PARTICIPANT);
                expect(res.participant).to.equal(participant);
            });
        });

        describe('remove', function () {
            it('should throw if called without a participant', function () {
                expect(() => actions.removeParticipant()).to.throw();
            });

            it('should throw if called with an invalid participant', function () {
                expect(() => actions.removeSheet('a')).to.throw();
            });

            it('should dispatch an event', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: {}, settings });

                const res = actions.fetchSheet(sheet.id)(store.dispatch, store.getState);
                expect(res.type).to.equal(Constants.ActionTypes.LOAD_SHEET);
                expect(res.payload.request.url).to.contain(`sheet/${sheet.id}`);
                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });

            it('should return an action with participant', function () {
                const participant = { id: 1 };
                const store = mockStore();
                const res = actions.removeParticipant(participant)(store.dispatch);

                expect(res.type).to.equal(Constants.ActionTypes.REMOVE_PARTICIPANT);
                expect(res.participant).to.equal(participant);
            });

            it('should call dispatch with action', function () {
                const participant = { id: 1 };
                const store = mockStore();
                const spy = sinon.spy(store, 'dispatch');

                const res = actions.removeParticipant(participant)(store.dispatch);

                expect(spy).to.have.been.calledWith({ type: res.type, participant: res.participant });
            });

            it('should dispatch an remove expense action if the array is not empty', function () {
                const participant = { id: 1 };
                const expensesToBeRemoved = [{ id: '1' }, { id: '2' }];
                const store = mockStore();
                const spy = sinon.spy(store, 'dispatch');

                actions.removeParticipant(participant, expensesToBeRemoved)(store.dispatch);

                expect(spy).to.have.been.called.thrice;
                expect(spy).to.have.been.calledWith({type: Constants.ActionTypes.REMOVE_EXPENSE, expense: expensesToBeRemoved[0]});
                expect(spy).to.have.been.calledWith({type: Constants.ActionTypes.REMOVE_EXPENSE, expense: expensesToBeRemoved[1]});
            });
        });
    });

    describe('Expense', function () {
        describe('add', function () {
            it('should throw if called without an expense', function () {
                expect(() => actions.addExpense()).to.throw();
            });

            it('should throw if called with an invalid expense', function () {
                expect(() => actions.addExpense('a')).to.throw();
            });

            it('should return an action with expense', function () {
                const expense = { id: 1 };
                const res = actions.addExpense(expense);

                expect(res.type).to.equal(Constants.ActionTypes.ADD_EXPENSE);
                expect(res.expense).to.equal(expense);
            });
        });

        describe('remove', function () {
            it('should throw if called without a expense', function () {
                expect(() => actions.removeExpense()).to.throw();
            });

            it('should throw if called with an invalid expense', function () {
                expect(() => actions.removeExpense('a')).to.throw();
            });

            it('should return an action with expense', function () {
                const expense = { id: 1 };
                const res = actions.removeExpense(expense);

                expect(res.type).to.equal(Constants.ActionTypes.REMOVE_EXPENSE);
                expect(res.expense).to.equal(expense);
            });
        });
    });
});