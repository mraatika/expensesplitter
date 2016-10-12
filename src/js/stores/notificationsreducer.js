import Constants from 'constants/appconstants';

/**
 * Notification reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function notifications(state = [], action) {
    switch(action.type) {
    case Constants.ErrorEventTypes.LOAD_SHEET:
    case Constants.ErrorEventTypes.SAVE_SHEET:
    case Constants.ErrorEventTypes.REMOVE_SHEET:
        return state.concat([ action.error ]);
    default:
        return state;
    }
}