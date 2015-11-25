import React from 'react';
import Router from '../router/router';
import DataStore from '../stores/datastore';
import storageFactory from '../factory/storagefactory';
import {name as appName, version} from '../../../package.json';

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
                    <h1><a href="/">{ appName }</a></h1>
                </header>

                <main role="main" id="content"></main>

                <footer role="contentinfo" className="text-right">
                    <small>{ `${appName} v${version}` }</small>
                </footer>
            </div>
        );
    }
}
