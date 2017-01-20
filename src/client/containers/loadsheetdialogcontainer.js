import {connect} from 'react-redux';
import {values} from 'ramda';
import LoadSheetDialog from 'client/components/home/loadsheetdialog.jsx';
import {clearHistory, removeSheetHistoryEntry} from 'client/stores/sheethistoryreducer';
import {toggleLoadSheetDialog} from 'client/stores/uireducer';

function mapStateToProps(state) {
    const {sheet, sheetHistory} = state;

    return {
        sheet,
        sheetHistory: values(sheetHistory),
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