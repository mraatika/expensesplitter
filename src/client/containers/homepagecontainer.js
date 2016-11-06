import HomePage from 'components/home/homepage.jsx';
import {connect} from 'react-redux';
import * as DataActions from 'actions/dataactioncreators';
import * as UiActions from 'actions/uiactioncreators';

function mapStateToProps(state) {
    const {sheet, dirty} = state.sheet;

    return {
        sheet,
        dirty,
        newSheetAdded: state.ui.newSheetAdded,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        /**
         * Create new sheet
         * @param  {Object} sheet
         */
        createSheet: sheet => dispatch(DataActions.createSheet(sheet)),

        /**
         * Save current sheet
         * @param  {Object} sheet
         */
        saveSheet: sheet => dispatch(DataActions.saveSheet(sheet)),

        /**
         * Update current sheet
         * @param  {Object} sheet
         * @param  {Object} updateObject
         */
        updateSheet: (sheet, updateObject) => dispatch(DataActions.updateSheet(sheet, updateObject)),

        /**
         * Remove current sheet
         * @param  {Object} sheet
         */
        removeSheet: sheet => dispatch(DataActions.removeSheet(sheet, ownProps.params.adminKey)),

        /**
         * Toggle load sheet dialog's display state
         * @param  {boolean} state
         */
        toggleLoadSheetDialog: state => dispatch(UiActions.toggleLoadSheetDialog(state)),

        /**
         * Toggle new sheet message's display state
         * @param  {boolean} state
         */
        toggleNewSheetAdded: state => dispatch(UiActions.toggleNewSheetAdded(state))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);