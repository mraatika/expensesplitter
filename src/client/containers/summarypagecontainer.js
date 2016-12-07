import {connect} from 'react-redux';
import {ArrayUtils} from 'client/util/utils';
import {removeSheet, saveSheet, updateSheet} from 'client/actions/dataactioncreators';
import SummaryPage from 'client/components/summary/summarypage.jsx';

function mapStateToProps(state) {
    const {expenses, participants, sheet} = state;
    const {isSavingToServer} = state.ui;

    return {
        sheet,
        expenses: ArrayUtils.rejectRemoved(expenses),
        participants: ArrayUtils.rejectRemoved(participants),
        isSavingToServer,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        /**
         * Remove current sheet
         * @param  {Object} sheet
         */
        removeSheet: sheet => dispatch(removeSheet(sheet, ownProps.params.adminKey)),
        /**
         * Save sheet to server
         * @param  {Object} sheet
         */
        saveSheet: sheet => dispatch(saveSheet(sheet)),

        /**
         * Update current sheet
         * @param  {Object} sheet
         */
        updateSheet: (sheet, update) => dispatch(updateSheet(sheet, update))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage);