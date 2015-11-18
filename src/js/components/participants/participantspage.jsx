'use strict';

import React from 'react';
import DataStore from '../../stores/datastore';
import pages from '../../constants/pages';
import {ParticipantList} from './participantlist.jsx';
import {ParticipantAddForm} from './participantaddform.jsx';
import {Navigation} from '../navigation/navigation.jsx';
import {t} from '../../dictionary/dictionary';

export class ParticipantsPage extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    _onChange() {
        var currentSheet = DataStore.getCurrentSheet();

        this.setState({
            currentSheet: currentSheet
        });
    }

    componentDidMount() {
        DataStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        DataStore.removeChangeListener(this._onChange);
    }

    render() {
        return (
            <section className="participants-page">
                <h1>{ t('lang.participant_plural') }:</h1>
                <ParticipantList participants={this.props.currentSheet.participants} sheet={this.props.currentSheet}/>
                <ParticipantAddForm participants={this.props.currentSheet.participants} />
                <Navigation
                    prev={pages.HOME}
                    next={pages.EXPENSES} />
            </section>

        );
    }
}
