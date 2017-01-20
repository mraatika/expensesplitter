import {connect} from 'react-redux';
import HomePage from 'client/components/home/homepage.jsx';
import {createSheet, removeSheet, saveSheet, updateSheet} from 'client/stores/sheetreducer';
import {toggleLoadSheetDialog, toggleNewSheetAdded, toggleSettingsSection} from 'client/stores/uireducer';

function mapStateToProps(state) {
    const {sheet} = state;
    const {newSheetAdded, showSettings} = state.ui;

    return {
        sheet,
        newSheetAdded,
        showSettings: showSettings === undefined ? sheet.dirty : showSettings,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch, ownProps) {
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
        removeSheet: sheet => dispatch(removeSheet(sheet, ownProps.params.adminKey)),

        /**
         * Toggle load sheet dialog's display state
         * @param  {boolean} state
         */
        toggleLoadSheetDialog: state => dispatch(toggleLoadSheetDialog(state)),

        /**
         * Toggle new sheet message's display state
         * @param  {boolean} state
         */
        toggleNewSheetAdded: state => dispatch(toggleNewSheetAdded(state)),

        /**
         * Toggle settings section
         * @param  {boolean} state
         */
        toggleSettingsSection: state => dispatch(toggleSettingsSection(state))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);