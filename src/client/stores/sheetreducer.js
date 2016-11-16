import {some} from 'lodash';
import immutable from 'object-path-immutable';
import Constants from 'client/constants/appconstants';
import sheetFactory from 'client/factory/sheetfactory';
import participantFactory from 'client/factory/participantfactory';
import expenseFactory from 'client/factory/expensefactory';

/**
 * Store's initial state
 * @type {Object}
 */
const initialState = {
    sheet: {},
    dirty: false
};

/**
 * Update state property if value changes
 * @param  {Object} state
 * @param  {string} name
 * @param  {*} value
 * @return {Object}
 */
const updateProperties = (state, properties) => {
    const isChanged = some(properties, (v, k) => state[k] !== v);
    return !isChanged ? state : {...state, ...properties};
};

/**
 * Set an entity's removed property to true in a sub array
 * @param  {Object} state
 * @param  {string} arrName
 * @param  {Object} entity
 * @return {Object}
 */
const removeEntity = (state, arrName, entity) => {
    const current = state.sheet[arrName];
    let index;

    for (const i in current) {
        if (current[i].id === entity.id) {
            index = i;
            break;
        }
    }

    return immutable(state)
        .del(`sheet.${arrName}.${index}`)
        .push(`sheet.${arrName}`, {...entity, removed: true })
        .value();
};

/**
 * Sheet related reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function sheetReducer(state = initialState, action) {

    switch(action.type) {
    // ACTIONS
    case Constants.ActionTypes.CREATE_SHEET:
        return updateProperties(state, { dirty: true, sheet: sheetFactory(action.sheet)});
    case Constants.ActionTypes.ADD_EXPENSE:
        return immutable.push(updateProperties(state, { dirty: true }), 'sheet.expenses', expenseFactory(action.expense));
    case Constants.ActionTypes.REMOVE_EXPENSE:
        return removeEntity(updateProperties(state, { dirty: true }), 'expenses', action.expense);
    case Constants.ActionTypes.ADD_PARTICIPANT:
        return immutable.push(updateProperties(state, { dirty: true }), 'sheet.participants', participantFactory(action.participant));
    case Constants.ActionTypes.REMOVE_PARTICIPANT:
        return removeEntity(updateProperties(state, { dirty: true }), 'participants', action.participant);
    case Constants.ActionTypes.UPDATE_SHEET:
        return updateProperties(state, { dirty: true, sheet: { ...state.sheet, ...action.update }});
    // EVENTS
    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        return updateProperties(state, { dirty: false, sheet: action.payload.data.sheet });
    // ERRORS
    case Constants.ErrorEventTypes.SAVE_SHEET:
        return updateProperties(state, { dirty: true });
    default:
        return state;
    }
}