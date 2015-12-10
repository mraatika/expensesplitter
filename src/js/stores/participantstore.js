import makeStore from 'makestore';
import _ from 'lodash';
import AppDispatcher from '../dispatchers/appdispatcher';
import Constants from '../constants/AppConstants.js';
import ParticipantFactory from '../factory/participantfactory';
import validation from '../validation/validation';
import * as Schema from '../validation/schema/schema';
import {ValidationError} from '../util/errors.js';

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
    let errors;

    if (!getParticipant(participant.id)) {

        errors = validation.validate(participant, Schema.Participant);

        if (!_.isEmpty(errors)) {
            throw new ValidationError('Participant validation failed', errors);
        }

        participants.push(participant);
        sheetParticipantIndex[participant.id] = sheetId;
        return true;
    }

    return false;
};

const addParticipants = (participants, sheetId) => {
    _.each(participants, p => addParticipant(p, sheetId));
};

const removeParticipant = participant => {
    participants = _.reject(participants, p => p.id == participant.id);
    sheetParticipantIndex = _.omit(sheetParticipantIndex, participant.id);
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

    /**
     * Dispatcher event listener. The only way to the store.
     * @param  {Object} payload
     */
    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;
        let shouldEmitChangeEvent = false;

        switch(action.type) {
        case Constants.ActionTypes.ADD_PARTICIPANT:
            try {
                const participant = ParticipantFactory.create(action.participant);
                shouldEmitChangeEvent = addParticipant(participant, action.sheetId);
            } catch(err) {
                console.error(err);
                ParticipantStore.emitChange(Constants.ErrorEventTypes.ADD_PARTICIPANT);
            }
            break;
        case Constants.ActionTypes.REMOVE_PARTICIPANT:
            removeParticipant(action.participant);
            shouldEmitChangeEvent = true;
            break;

        case Constants.EventTypes.LOAD_SHEET_SUCCESS:
            addParticipants(action.sheet.participants, action.sheet.id);
            shouldEmitChangeEvent = true;
        }

        if (shouldEmitChangeEvent) {
            ParticipantStore.emitChange(Constants.EventTypes.CHANGE_EVENT);
        }
    })
});

export default ParticipantStore;