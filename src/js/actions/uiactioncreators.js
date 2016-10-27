import Constants from 'constants/appconstants';

/**
 *
 *
 * PUBLIC API
 *
 *
 */


/**
 * Toggle load sheet dialog's display state
 * @param  {boolean} state Show or not to show
 * @return {Object}
 */
export function toggleLoadSheetDialog(state) {
    return {
        type: Constants.ActionTypes.TOGGLE_LOAD_SHEET_DIALOG,
        state
    };
}