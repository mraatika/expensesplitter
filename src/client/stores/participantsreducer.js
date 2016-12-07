import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import {ArrayUtils} from 'client/util/utils';
import participantFactory from 'client/factory/participantfactory';

/**
 * Participants reducer
 * @param  {Array} state
 * @param  {Object} action
 * @return {Object}
 */
export function participantsReducer(state = [], action) {
    switch(action.type) {
    case Constants.ActionTypes.CREATE_SHEET:
        return [];
    case Constants.ActionTypes.ADD_PARTICIPANT:
        return state.concat(participantFactory(action.participant));
    case Constants.ActionTypes.REMOVE_PARTICIPANT:
        {
            const index = ArrayUtils.findIndexById(state, action.participant);
            return immutable.set(state, `${index}.removed`, true);
        }
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return [].concat(action.payload.data.sheet.participants);
    default:
        return state;
    }
}