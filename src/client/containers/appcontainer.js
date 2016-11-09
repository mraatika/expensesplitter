import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import App from 'client/components/app.jsx';
import {createSheet, fetchSheet, setSettings} from 'client/actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet, dirty} = state.sheet;
    const {isFetching} = state.ui;

    return {
        sheet,
        isFetching,
        dirty,
        notifications: state.notifications,
        language: state.settings.language
    };
}

function mapDispatchToProps(dispatch) {
    return {
        /**
         * Fetch sheet from the  server
         * @param  {string} sheetId Sheet's id
         */
        fetchSheet: sheetId => dispatch(fetchSheet(sheetId))
            .then((response) => {
                // even if request fails with a server error then handler is called
                if (response.error) browserHistory.push('/');
            })
            .catch(() => browserHistory.push('/')),
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