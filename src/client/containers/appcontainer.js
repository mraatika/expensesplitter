import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import App from 'components/app.jsx';
import {createSheet, fetchSheet, setSettings} from 'actions/dataactioncreators';

function mapStateToProps(state) {
    const {sheet, isFetching, dirty} = state.sheet;

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
                if (response.error) dispatch(push('/'));
            })
            .catch(() => dispatch(push('/'))),
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