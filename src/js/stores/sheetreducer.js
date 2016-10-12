import Constants from 'constants/appconstants';
import SheetFactory from 'factory/sheetfactory';

/**
 * Curry function for state cloning and extending
 * @param  {Object} state
 * @return {Function}
 */
function stateAssign(state) {
    /**
     * Clone and extend state with given params
     * @param  {Object} stateParams
     * @return {Object}
     */
    return (stateParams) => {
        return Object.assign({}, state, stateParams);
    };
}

/**
 * Store's initial state
 * @type {Object}
 */
const initialState = {
    sheet: {},
    isFetching: false,
    dirty: false,
    isSavingToServer: false
};


/**
 * Sheet related reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export function sheet(state = initialState, action) {
    const assignToState = stateAssign(state);

    switch(action.type) {

    // ACTIONS

    case Constants.ActionTypes.REQUEST_SHEET:
        return assignToState({
            isFetching: true
        });
    case Constants.ActionTypes.CREATE_SHEET:
        {
            const sheet = SheetFactory.create(action.sheet);
            return assignToState({ sheet });
        }
    case Constants.ActionTypes.SAVE_SHEET:
        {
            return assignToState({
                isSavingToServer: true
            });
        }
    case Constants.ActionTypes.UPDATE_SHEET:
        {
            const sheet = Object.assign({}, state.sheet, action.update);
            return assignToState({
                sheet,
                dirty: true
            });
        }

    // EVENTS

    case Constants.EventTypes.LOAD_SHEET_SUCCESS:
        return assignToState({
            isFetching: false,
            sheet: action.sheet
        });
    case Constants.EventTypes.SAVE_SHEET_SUCCESS:
        {
            return assignToState({
                sheet: action.sheet,
                dirty: false,
                isSavingToServer: false
            });
        }

    // ERRORS

    case Constants.ErrorEventTypes.LOAD_SHEET:
        return assignToState({
            isFetching: false
        });
    case Constants.ErrorEventTypes.SAVE_SHEET:
        {
            return assignToState({
                dirty: true,
                isSavingToServer: false
            });
        }
    default:
        return state;
    }
}