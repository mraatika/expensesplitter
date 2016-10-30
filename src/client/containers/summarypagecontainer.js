import {connect} from 'react-redux';
import SummaryPage from 'components/summary/summarypage.jsx';
import {removeSheet, saveSheet, updateSheet} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet, dirty, isSavingToServer} = state.sheet;
    return {
        sheet,
        dirty,
        isSavingToServer,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        /**
         * Remove current sheet
         * @param  {Object} sheet
         */
        removeSheet: sheet => dispatch(removeSheet(sheet)),
        /**
         * Save sheet to server
         * @param  {Object} sheet
         */
        saveSheet: sheet => dispatch(saveSheet(sheet)),

        updateSheet: (sheet, update) => dispatch(updateSheet(sheet, update))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage);