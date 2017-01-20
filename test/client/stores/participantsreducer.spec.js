import {expect} from 'chai';
import {omit} from 'ramda';
import sinon from 'sinon';
import {addParticipant, removeParticipant, ADD_PARTICIPANT, REMOVE_PARTICIPANT} from 'client/stores/participantsreducer';
import {REMOVE_EXPENSE} from 'client/stores/expensesreducer';
import {fetchSheet, removeSheet, LOAD_SHEET_SUCCESS} from 'client/stores/sheetreducer';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import participantFactory from 'client/factory/participantfactory';
import {CREATE_SHEET, LOAD_SHEET} from 'client/stores/sheetreducer';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

const proxyquire = require('proxyquire');
proxyquire.noCallThru();
proxyquire.noPreserveCache();

const participantFactoryStub = sinon.stub();

const reducer = proxyquire('client/stores/participantsreducer', {
    'client/factory/participantfactory': participantFactoryStub
}).default;

describe('Reducer:ParticipantsReducer', function () {
    const initialState = [];
    const findByIndex = function(arr, id) {
        return arr.findIndex(e => e.id === id);
    };

    describe('Initial state', function () {
        it('should be an empty array', function () {
            const res = reducer(undefined, {});
            expect(res).to.be.an('array');
            expect(res).to.be.empty;
        });

        it('should return default state if action is not handled', function () {
            const initialState = [{ id:1 }];
            const res = reducer(initialState, {});
            expect(res).to.equal(initialState);
        });
    });

    describe('Sheet load', function () {
        const participants = [ { id: 1 }, { id: 2} ];
        const sheet = { participants };
        const action = { type: LOAD_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should add all participants to state when a sheet is loaded', function () {
            const res = reducer(undefined, action);
            expect(res).to.have.lengthOf(participants.length);
        });
    });

    describe('Sheet create', function () {
        const initialState = [ { id: 1 }, { id: 2} ];
        const action = { type: CREATE_SHEET };

        it('should clear the state when a new sheet is created', function () {
            const res = reducer(initialState, action);
            expect(res).to.be.an('array');
            expect(res).to.be.empty;
        });
    });

    describe('Add participants', function () {
        const participant = { id: '1', name: 'testname' };
        const action = { type: ADD_PARTICIPANT, participant };

        it('should add participant to sheet\'s participants', function () {
            participantFactoryStub.returns(participant);

            const res = reducer(initialState, action);

            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.equal(participant);
        });

        it('should not modify the original array', function () {
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Remove participants', function () {
        const participant = { id: '1', name: 'testname' };
        const action = { type: REMOVE_PARTICIPANT, participant };
        const initialState = [{ id: '1' }, { id: '2' }];

        it('should mark participant removed', function () {
            const res = reducer(initialState, action);

            expect(res).to.have.lengthOf(2);
            expect(res[findByIndex(initialState, participant.id)].removed).to.be.ok;
        });

        it('should not modify the original array', function () {
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('ActionCreators:Participant', function () {
        describe('add', function () {
            it('should throw if called without a participant', function () {
                expect(() => addParticipant()).to.throw();
            });

            it('should throw if called with an invalid participant', function () {
                expect(() => addParticipant('a')).to.throw();
            });

            it('should return an action with participant', function () {
                const participant = { id: 1, name: 'Keke' };
                const payload = addParticipant(participant);
                const expected = omit(['id'], participantFactory(participant));

                expect(payload.type).to.equal(ADD_PARTICIPANT);
                expect(payload.participant.id).to.be.ok;
                expect(omit(['id'], payload.participant)).to.deep.equal(expected);
            });
        });

        describe('remove', function () {
            it('should throw if called without a participant', function () {
                expect(() => removeParticipant()).to.throw();
            });

            it('should throw if called with an invalid participant', function () {
                expect(() => removeSheet('a')).to.throw();
            });

            it('should dispatch an event', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: {}, settings });

                const res = fetchSheet(sheet.id)(store.dispatch, store.getState);
                expect(res.type).to.equal(LOAD_SHEET);
                expect(res.payload.request.url).to.contain(`sheet/${sheet.id}`);
                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });

            it('should return an action with participant', function () {
                const participant = { id: 1 };
                const store = mockStore();
                const res = removeParticipant(participant)(store.dispatch);

                expect(res.type).to.equal(REMOVE_PARTICIPANT);
                expect(res.participant).to.equal(participant);
            });

            it('should call dispatch with action', function () {
                const participant = { id: 1 };
                const store = mockStore();
                const spy = sinon.spy(store, 'dispatch');

                const res = removeParticipant(participant)(store.dispatch);

                expect(spy).to.have.been.calledWith({ type: res.type, participant: res.participant });
            });

            it('should dispatch an remove expense action if the array is not empty', function () {
                const participant = { id: 1 };
                const expensesToBeRemoved = [{ id: '1' }, { id: '2' }];
                const store = mockStore();
                const spy = sinon.spy(store, 'dispatch');

                removeParticipant(participant, expensesToBeRemoved)(store.dispatch);

                expect(spy).to.have.been.called.thrice;
                expect(spy).to.have.been.calledWith({type: REMOVE_EXPENSE, expense: expensesToBeRemoved[0]});
                expect(spy).to.have.been.calledWith({type: REMOVE_EXPENSE, expense: expensesToBeRemoved[1]});
            });
        });
    });
});

