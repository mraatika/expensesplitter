import HomePage from 'components/home/homepage.jsx';
import {connect} from 'react-redux';
import {clearHistory, createSheet, removeSheet, saveSheet, updateSheet} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet, newSheetCreated, dirty} = state.sheet;

    return {
        sheet,
        newSheetCreated,
        dirty,
        sheetHistory: state.sheetHistory,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {

    return {
        /**
         * Create new sheet
         * @param  {Object} sheet
         */
        createSheet: sheet => dispatch(createSheet(sheet)),

        /**
         * Save current sheet
         * @param  {Object} sheet
         */
        saveSheet: sheet => dispatch(saveSheet(sheet)),

        /**
         * Update current sheet
         * @param  {Object} sheet
         * @param  {Object} updateObject
         */
        updateSheet: (sheet, updateObject) => dispatch(updateSheet(sheet, updateObject)),

        /**
         * Remove current sheet
         * @param  {Object} sheet
         */
        removeSheet: sheet => dispatch(removeSheet(sheet)),

        /**
         * Clear sheet history
         */
        clearSheetHistory: () => { dispatch(clearHistory()); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);