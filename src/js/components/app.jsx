import React from 'react';
import Swipeable from 'react-swipeable';
import {name as appName, version} from '../../../package.json';
import Router from '../router/router';
import SheetStore from '../stores/sheetstore.js';
import SettingsStore from '../stores/settingsstore.js';
import LanguagesSection from './language/languagessection.jsx';
import Constants from '../constants/AppConstants.js';
import {setLanguage} from '../dictionary/dictionary.js';

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
        this._setInitialLanguage();
    }

    componentDidMount() {
        Router.start();
        SettingsStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SettingsStore.removeChangeListener(this._onChange);
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
            Router.navigateTo(Router.getCurrentRoute().href);
        }
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
                        <h1><a href="/">{ appName }</a></h1>
                    </header>

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
