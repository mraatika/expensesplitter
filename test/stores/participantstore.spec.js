import sinon from 'sinon';
import {expect} from 'chai';
import getStubs from '../support/stubs.js';
import Constants from '../../src/js/constants/AppConstants';

const proxyquire = require('proxyquire').noCallThru();

describe('ParticipantStore', function () {

    let ParticipantStore;
    let dispatch;
    const stubs = getStubs();

    before(() => {
        ParticipantStore = proxyquire('../../src/js/stores/participantstore.js', {
            '../dispatchers/appdispatcher': stubs.dispatcher,
            '../validation/validation': stubs.validation,
            '../factory/participantfactory': stubs.factory
        }).default;

        dispatch = stubs.dispatcher.register.getCall(0).args[0];
    });

    afterEach(() => {
        ParticipantStore.removeAllListeners();
    });

    const createPayload = (participant, sheetId) => {
        return {
            action: {
                type: Constants.ActionTypes.ADD_PARTICIPANT,
                participant,
                sheetId
            }
        };
    };

    const removePayload = participant => {
        return {
            action: {
                type: Constants.ActionTypes.REMOVE_PARTICIPANT,
                participant
            }
        };
    };

    const removeAll = sheetId => {
        ParticipantStore.getParticipants(sheetId).forEach(p => dispatch(removePayload(p)));
    };

    const addParticipants = (participants, sheetId) => {
        participants.forEach(p => {
            stubs.factory.create.returns(p);
            dispatch(createPayload(p, sheetId));
        });
    };

    it('should register a callback with the dispatcher', function () {
        expect(stubs.dispatcher.register.called).to.be.ok;
    });

    it('should return an empty array when getParticipants is called without sheetId', function () {
        expect(ParticipantStore.getParticipants()).to.be.an('array');
    });

    describe('ACTIONS', function () {

        describe('Creating a participant', function () {
            const participant = { id: '1', name: 'John' };
            const sheetId = '1';

            afterEach(() => {
                removeAll(sheetId);
            });

            it('should add a valid participant to the store', function () {
                stubs.factory.create.returns(participant);
                expect(ParticipantStore.getParticipant(participant.id)).to.be.undefined;
                dispatch(createPayload(participant, sheetId));
                expect(ParticipantStore.getParticipant(participant.id)).not.to.be.undefined;
            });

            it('should not add same participant twice', function () {
                stubs.factory.create.returns(participant);
                expect(ParticipantStore.getParticipant(participant.id)).to.be.undefined;
                dispatch(createPayload(participant, sheetId));
                dispatch(createPayload(participant, sheetId));
                expect(ParticipantStore.getParticipant(participant.id)).not.to.be.undefined;
            });

            it('should fire a change event after participant is succesfully created', function () {
                const spy = sinon.spy();

                stubs.factory.create.returns(participant);

                ParticipantStore.addChangeListener(spy);

                dispatch(createPayload(participant, sheetId));

                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

            it('should fire an error event when trying to add participant with invalid props', function () {
                const spy = sinon.spy();

                stubs.factory.create.returns(participant);
                stubs.validation.validate.returns({ name: true });

                ParticipantStore.addChangeListener(spy);

                dispatch(createPayload(participant, sheetId));

                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_PARTICIPANT)).to.be.ok;

                stubs.validation.validate.returns({});
            });

            it('should also connect participant with given sheet', function () {
                stubs.factory.create.returns(participant);
                dispatch(createPayload(participant, sheetId));
                expect(ParticipantStore.getParticipants(sheetId).length).to.equal(1);
            });
        });

        describe('Removing participants', function () {
            const participants = [
                { id:'1', name: 'John' },
                { id:'2', name: 'Jane' },
                { id:'3', name: 'Dick' }
            ];
            const sheetId = '2';

            beforeEach(() => {
                addParticipants(participants, sheetId);
            });

            afterEach(() => {
                removeAll(sheetId);
            });

            describe('Removing a single participant', function () {
                it('should remove a participant with id', function () {
                    dispatch(removePayload(participants[0]));
                    expect(ParticipantStore.getParticipant(participants[0].id)).to.be.undefined;
                });

                it('should also remove participant from the sheet participant connection array', function () {
                    dispatch(removePayload(participants[0]));
                    expect(ParticipantStore.getParticipants(sheetId).length).to.equal(2);
                });

                it('should emit a change event after an participant is removed', function () {
                    const spy = sinon.spy();
                    ParticipantStore.addChangeListener(spy);
                    dispatch(removePayload(participants[0]));
                    expect(spy.callCount).to.equal(1);
                    expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
                });

                it('should not emit a change event if participant is not found', function () {
                    const spy = sinon.spy();
                    const participant = { 'id': '444' };
                    ParticipantStore.addChangeListener(spy);
                    dispatch(removePayload(participant));
                    expect(spy.called).not.to.be.ok;
                });
            });
        });
    });

    describe('EVENTS', function () {
        const sheet = {
            id: '1',
            participants: [{ id: '1' }, { id: '2'}]
        };

        const loadSheetSuccessPayload = () => {
            return {
                action: {
                    type: Constants.EventTypes.LOAD_SHEET_SUCCESS,
                    sheet: sheet
                }
            };
        };

        describe('Load sheet success event', function () {
            it('should add all participants of a sheet to the store', function () {
                expect(ParticipantStore.getParticipants(sheet.id).length).to.equal(0);
                dispatch(loadSheetSuccessPayload());
                expect(ParticipantStore.getParticipants(sheet.id).length).to.equal(2);
            });

            it('should emit a change event after', function () {
                const spy = sinon.spy();
                ParticipantStore.addChangeListener(spy);
                dispatch(loadSheetSuccessPayload());
                expect(spy.calledWith(Constants.EventTypes.CHANGE_EVENT)).to.be.ok;
            });

            it('should emit an error event if at least one of the adds fails', function () {
                const spy = sinon.spy();
                stubs.validation.validate.withArgs(sheet.participants[1]).returns({ name: true });
                ParticipantStore.addChangeListener(spy);
                dispatch(loadSheetSuccessPayload());
                expect(spy.calledWith(Constants.ErrorEventTypes.ADD_PARTICIPANT)).to.be.ok;
                stubs.validation.validate.returns({});
            });
        });
    });
});