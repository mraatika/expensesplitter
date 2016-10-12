import React from 'react';
import {Link} from 'react-router';
import Swipeable from 'react-swipeable';
import NotificationSystem from 'react-notification-system';
import {name as appName, version} from '../../../package.json';
import LanguagesSection from 'components/language/languagessection.jsx';
import {Modal} from 'react-bootstrap';
import {t} from 'dictionary/dictionary.js';
import RouterService from 'router/routerservice';

// import styles
import 'font-awesome-sass-loader';
import 'styles/main.scss';

/**
 * @class App
 * @description Main component for ExpenseSplitter
 * @extends {ReactComponent}
 */
class App extends React.Component {

    constructor(props) {
        super(props);
        this._promptCloseIfDirty = this._promptCloseIfDirty.bind(this);
    }

    componentWillMount() {
        // sheet id from the router
        const sheetId = this.props.params.sheetId;

        // create a dummy sheet even if sheet id is given
        // so there's always a sheet
        this.props.createSheet({});

        if (sheetId) {
            this.props.fetchSheet(sheetId);
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this._promptCloseIfDirty);
    }

    componentWillReceiveProps(nextProps) {
        // check for notifications
        if (nextProps.notifications.length !== this.props.notifications.length) {
            const {notifications} = nextProps;
            this._notificationSystem.addNotification(notifications[notifications.length - 1]);
        }

        // replace active sheet with a new sheet when navigated to root url without the id in url params
        if (this.props.params.sheetId && !nextProps.params.sheetId) {
            this.props.createSheet({});
            return;
        }

        // fetch sheet from the server if navigated from the root url to url with sheet id in url params
        if (!this.props.params.sheetId && nextProps.params.sheetId) {
            // check if the sheet was ever saved 'cause
            // when a new sheet is created the id in url params is empty
            // and then moving to participants the id will be in url params but
            // the sheet is not yet saved to the db
            if (nextProps.sheet.lastSavedOn) {
                this.props.fetchSheet(nextProps.params.sheetId);
            }
            return;
        }

        // fetch sheet from the server when the sheet id in url params is changed from sheet id to sheet id
        if (this.props.params.sheetId && nextProps.params.sheetId && (this.props.params.sheetId !== nextProps.params.sheetId)) {
            this.props.fetchSheet(nextProps.params.sheetId);
            return;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this._promptCloseIfDirty);
    }

    /**
     * Display confirmation before closing if the sheet is not saved
     * @private
     * @param   {Event} e
     * @return  {string}
     */
    _promptCloseIfDirty(e) {
        if (this.props.dirty) {
            const message = t('app.close_prompt_message');
            e.returnValue = message;
            return message;
        }
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {isFetching} = this.props;
        const {sheetId} = this.props.params;

        return (
            <Swipeable
                onSwipedRight={() => RouterService.prev()}
                onSwipedLeft={() => RouterService.next()}>

                <div id="app-wrapper" className="container">
                    <header role="banner">
                        <h1><Link to={'/' + (sheetId ? `sheet/${sheetId}` : '' )}>{ appName }</Link></h1>
                    </header>

                    <Modal show={isFetching}>
                        <Modal.Body>
                            <div className="text-center">
                                <i className="fa fa-spinner fa-3x fa-spin" />&nbsp;
                                <span className="italic">{t('lang.loading')}...</span>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <NotificationSystem ref={ c => this._notificationSystem = c} />

                    <main role="main" id="content">
                        { React.cloneElement(this.props.children) }
                    </main>

                    <footer role="contentinfo" className="text-right">
                        <div className="u-pull-left">
                            <LanguagesSection setLanguage={this.props.setLanguage} />
                        </div>
                        <small className="u-pull-right">{ `${appName} v${version}` }</small>
                    </footer>
                </div>
            </Swipeable>
        );
    }
}

export default App;