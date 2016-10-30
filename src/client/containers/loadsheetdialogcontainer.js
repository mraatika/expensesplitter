import LoadSheetDialog from 'components/home/loadsheetdialog.jsx';
import {connect} from 'react-redux';
import {toArray} from 'lodash';
import {clearHistory, removeSheetHistoryEntry} from 'actions/dataactioncreators';
import {toggleLoadSheetDialog} from 'actions/uiactioncreators';

function mapStateToProps(state) {

    return {
        sheet: state.sheet.sheet,
        sheetHistory: toArray(state.sheetHistory),
        show: state.ui.showLoadSheetDialog
    };
}

function mapDispatchToProps(dispatch) {

    return {
        /**
         * Clear sheet history
         */
        clearSheetHistory: () => dispatch(clearHistory()),

        /**
         * Remove a single sheet history entry
         * @param  {Object} entry
         */
        removeSheetHistoryEntry: entry => dispatch(removeSheetHistoryEntry(entry)),

        /**
         * Toggle dialog's display state
         * @param  {boolean} state
         */
        toggleLoadSheetDialog: state => dispatch(toggleLoadSheetDialog(state))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadSheetDialog);