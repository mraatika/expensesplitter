import immutable from 'object-path-immutable';
import {ArrayUtils, isObject} from 'client/util/utils';
import {InvalidArgumentsError} from 'client/util/errors';
import participantFactory from 'client/factory/participantfactory';
import {removeExpense} from 'client/stores/expensesreducer';
import {CREATE_SHEET, LOAD_SHEET_SUCCESS} from 'client/stores/sheetreducer';

/**
 * Event types
 */
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT';

/**
 * Participants reducer
 * @param  {Array} state
 * @param  {Object} action
 * @return {Object}
 */
export default function reducer(state = [], action) {
    switch(action.type) {
    case CREATE_SHEET:
        return [];
    case ADD_PARTICIPANT:
        return state.concat(action.participant);
    case REMOVE_PARTICIPANT:
        {
            const index = ArrayUtils.findIndexById(state, action.participant);
            return immutable.set(state, `${index}.removed`, true);
        }
    case LOAD_SHEET_SUCCESS:
        return [].concat(action.payload.data.sheet.participants);
    default:
        return state;
    }
}

/**
 * Add a participant to sheet
 * @param  {Object} participant
 * @return {Object}
 */
export function addParticipant(participant) {
    if (!isObject(participant)) throw new InvalidArgumentsError('participant missing or invalid!');

    return {
        type: ADD_PARTICIPANT,
        participant: participantFactory(participant)
    };
}

/**
 * Remove participant from sheet
 * @param  {Object} participant
 * @param  {Array} expensesToBeRemoved
 * @return {Function}
 */
export function removeParticipant(participant, expensesToBeRemoved = []) {
    if (!isObject(participant)) throw new InvalidArgumentsError('participant missing or invalid!');

    return (dispatch) => {
        // remove all expenses
        expensesToBeRemoved.forEach(e => dispatch(removeExpense(e)));

        return dispatch({
            type: REMOVE_PARTICIPANT,
            participant
        });
    };
}