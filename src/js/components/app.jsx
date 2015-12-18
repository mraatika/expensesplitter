import React from 'react';
import Swipeable from 'react-swipeable';
import NotificationSystem from 'react-notification-system';
import {name as appName, version} from '../../../package.json';
import NotificationStore from '../stores/notificationstore.js';
import ActionCreators from '../actions/dataactioncreators.js';
import Router from '../router/router';
import pages from '../constants/pages.js';
import SheetStore from '../stores/sheetstore.js';
import SettingsStore from '../stores/settingsstore.js';
import LanguagesSection from './language/languagessection.jsx';
import Constants from '../constants/AppConstants.js';
import {setLanguage} from '../dictionary/dictionary.js';
import {URLUtils} from '../util/utils.js';
import {Modal} from 'react-bootstrap';
import {t} from '../dictionary/dictionary.js';

/**
 * @class App
 * @description Main component for ExpenseSplitter
 * @extends {ReactComponent}
 */
export default class App extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     * @return {App}
     */
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onNotficationAdded = this._onNotficationAdded.bind(this);
        this.state = { isLoading: true };
        this._setInitialLanguage();
    }

    componentWillMount() {
        const currentSheetId = URLUtils.getCurrentSheetId();

        if (currentSheetId) {
            ActionCreators.loadSheet(currentSheetId);
        } else {
            this.setState({ isLoading: false });
        }
    }

    componentDidMount() {
        Router.start();

        SettingsStore.addChangeListener(this._onChange);
        SheetStore.addChangeListener(this._onChange);
        NotificationStore.addChangeListener(this._onNotficationAdded);
    }

    componentWillUnmount() {
        SettingsStore.removeChangeListener(this._onChange);
        SheetStore.removeChangeListener(this._onChange);
        NotificationStore.removeChangeListener(this._onNotficationAdded);
    }

    /**
     * Change listener for the settings store
     * @param  {Symbol} eventType
     * @return {undefined}
     */
    _onChange(eventType) {
        if (eventType == Constants.EventTypes.LANGUAGE_CHANGED_EVENT) {
            setLanguage(SettingsStore.getSettings().language);
            // reload route to completely rerender the page
            Router.navigateTo(window.location.pathname);
        }

        if (eventType == Constants.EventTypes.LOAD_SHEET_SUCCESS) {
            Router.navigateToSheetURL(Router.getCurrentRoute().href);
        }

        if (eventType == Constants.ErrorEventTypes.LOAD_SHEET) {
            Router.navigateTo(pages.HOME.href);
        }

        this.setState({ isLoading: false });
    }

    _onNotficationAdded() {
        const notification = NotificationStore.getLastNotification();
        this._notificationSystem.addNotification(notification);
    }

    /**
     * Load saved language and set it to dictionary
     * @private
     * @return {undefined}
     */
    _setInitialLanguage() {
        const currentLanguage = SettingsStore.getSettings().language;

        if (currentLanguage) {
            setLanguage(currentLanguage);
        }
    }

    _onHomeLinkClick(e) {
        e.preventDefault();
        Router.navigateToSheetURL(pages.HOME.href);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <Swipeable
                onSwipedRight={() => Router.prev()}
                onSwipedLeft={() => Router.next()}>

                <div id="app-wrapper" className="container">
                    <header role="banner">
                        <h1><a href="/" onClick={this._onHomeLinkClick}>{ appName }</a></h1>
                    </header>

                    <Modal show={this.state.isLoading}>
                        <Modal.Body>
                            <div className="text-center">
                                <i className="fa fa-spinner fa-3x fa-spin" />&nbsp;
                                <span className="italic">{t('lang.loading')}...</span>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <NotificationSystem ref={ c => this._notificationSystem = c} />

                    <main role="main" id="content"></main>

                    <footer role="contentinfo" className="text-right">
                        <div className="u-pull-left">
                            <LanguagesSection />
                        </div>
                        <small className="u-pull-right">{ `${appName} v${version}` }</small>
                    </footer>
                </div>
            </Swipeable>
        );
    }
}
