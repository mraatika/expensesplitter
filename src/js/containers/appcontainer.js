import {connect} from 'react-redux';
import App from 'components/app.jsx';
import {createSheet, fetchSheet, setSettings} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet, isFetching} = state.sheet;

    return {
        sheet,
        isFetching,
        notifications: state.notifications
    };
}

function mapDispatchToProps(dispatch) {
    return {
        /**
         * Fetch sheet from the  server
         * @param  {string} sheetId Sheet's id
         */
        fetchSheet: sheetId => dispatch(fetchSheet(sheetId)),
        /**
         * Create new sheet
         * @param  {Object} sheet Sheet's properties
         */
        createSheet: sheet => dispatch(createSheet(sheet)),
        /**
         * Change the language
         * @param  {string} lang
         */
        setLanguage: lang => dispatch(setSettings({ language: lang }))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);