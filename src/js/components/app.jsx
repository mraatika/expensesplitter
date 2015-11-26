import React from 'react';
import {name as appName, version} from '../../../package.json';
import Router from '../router/router';
import SheetStore from '../stores/sheetstore.js';
import SettingsStore from '../stores/settingsstore.js';
import storageFactory from '../factory/storagefactory';
import LanguagesSection from './header/languagessection.jsx';
import Constants from '../constants/AppConstants.js';
import {setLanguage} from '../dictionary/dictionary.js';

export default class App extends React.Component {

    componentWillMount() {
        SheetStore.init(storageFactory.create(Constants.SHEET_STORE_NAME));
        SettingsStore.init(storageFactory.create(Constants.SETTINGS_STORE_NAME));
    }

    componentDidMount() {
        Router.start();
        SettingsStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SettingsStore.removeChangeListener(this._onChange);
    }

    _onChange(eventType) {
        if (eventType == Constants.EventTypes.LANGUAGE_CHANGED_EVENT) {
            setLanguage(SettingsStore.getSettings().language);
        }
    }

    render() {
        return (
            <div id="app-wrapper" className="container">
                <header role="banner">
                    <h1><a href="/">{ appName }</a></h1>
                </header>

                <main role="main" id="content"></main>

                <footer role="contentinfo" className="text-right">
                    <div className="u-pull-left">
                        <LanguagesSection/>
                    </div>
                    <small className="u-pull-right">{ `${appName} v${version}` }</small>
                </footer>
            </div>
        );
    }
}
