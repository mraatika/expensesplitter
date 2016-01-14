import makeStore from 'makestore';
import _ from 'lodash';
import AppDispatcher from '../dispatchers/appdispatcher';
import Constants from '../constants/AppConstants.js';
import ParticipantFactory from '../factory/participantfactory';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';

// participant storage
let participants = [];
// participant-sheet relation mapping
let sheetParticipantIndex = {};

const getParticipant = participantId => {
    return _.find(participants, p => p.id == participantId);
};

const getParticipantsBySheetId = sheetId => {
    return _.filter(participants, p => sheetParticipantIndex[p.id] == sheetId);
};

const addParticipant = (participant, sheetId) => {
    const errors = validation.validate(participant, Schema.Participant);

    if (!_.isEmpty(errors)) return false;

    participants.push(participant);
    sheetParticipantIndex[participant.id] = sheetId;
    return true;
};

const addParticipants = (participants, sheetId) => {
    // return true if all adds succeeded
    return _.all(participants, p => {
        if (!getParticipant(p.id))  return addParticipant(p, sheetId);
        return true;
    });
};

const removeParticipant = participant => {
    if (!getParticipant(participant.id)) return false;
    participants = _.reject(participants, p => p.id == participant.id);
    sheetParticipantIndex = _.omit(sheetParticipantIndex, participant.id);
    return true;
};

/**
 * @class ParticipantStore
 * @description Store for participant models
 */
const ParticipantStore = makeStore({

    /**
     * Return participants of a sheet or if omitted will return all participants
     * @param  {string} [sheetId]
     * @return {array}
     */
    getParticipants(sheetId) {
        return sheetId ? getParticipantsBySheetId(sheetId) : [];
    },

    /**
     * Get single participant
     * @param  {string} participantId
     * @return {Object}
     */
    getParticipant(participantId) {
        return getParticipant(participantId);
    },

    _emitChangeEvent() {
        ParticipantStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
    },

    /**
     * Dispatcher event listener. The only way to the store.
     * @param  {Object} payload
     */
    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;

        switch(action.type) {
        case Constants.ActionTypes.ADD_PARTICIPANT:
            if (!getParticipant(action.participant.id)) {
                const participant = ParticipantFactory.create(action.participant);

                if (addParticipant(participant, action.sheetId)) {
                    ParticipantStore._emitChangeEvent();
                } else {
                    ParticipantStore.emitChange(Constants.ErrorEventTypes.ADD_PARTICIPANT);
                }
            }
            break;
        case Constants.ActionTypes.REMOVE_PARTICIPANT:
            if (removeParticipant(action.participant)) {
                ParticipantStore._emitChangeEvent();
            }
            break;

        case Constants.EventTypes.LOAD_SHEET_SUCCESS:
            if (addParticipants(action.sheet.participants, action.sheet.id)) {
                ParticipantStore._emitChangeEvent();
            } else {
                ParticipantStore.emitChange(Constants.ErrorEventTypes.ADD_PARTICIPANT);
            }
        }
    })
});

export default ParticipantStore;