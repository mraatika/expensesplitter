import React from 'react';
import Router from '../router/router';
import DataStore from '../stores/datastore';
import storageFactory from '../factory/storagefactory';
import {t} from '../dictionary/dictionary';
import {name as appName} from '../../../package.json';
import packageJSON from '../../../package.json';

export class App extends React.Component {

    componentWillMount() {
        DataStore.init(storageFactory.create());
    }

    componentDidMount() {
        Router.start();
    }

    render() {
        return (
            <div id="app-wrapper" className="container">
                <header role="banner">
                    <h1>
                        <a href="/">{ appName }</a>
                        <span id="app-header-info">{'- ' + t('app.info') }</span>
                    </h1>
                </header>

                <main role="main" id="content"></main>

                <footer role="contentinfo" className="text-right">
                    <small>{ `${packageJSON.name} v${packageJSON.version}` }</small>
                </footer>
            </div>
        );
    }
}
