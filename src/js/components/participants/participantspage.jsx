import React from 'react';
import DataStore from '../../stores/datastore';
import pages from '../../constants/pages';
import ParticipantList from './participantlist.jsx';
import {ParticipantAddForm} from './participantaddform.jsx';
import {Navigation} from '../navigation/navigation.jsx';
import {t} from '../../dictionary/dictionary';

/**
 * @class ParticipantsPage
 * @description Page for displaying and adding participants
 * @extends {ReactComponent}
 */
export default class ParticipantsPage extends React.Component {
    /**
     * @constructor
     * @param  {object} props
     * @return {ParticipantsPage}
     */
    constructor(props) {
        super(props);
        this.state = { currentSheet: this.props.currentSheet };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        DataStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        DataStore.removeChangeListener(this._onChange);
    }

    /**
     * Callback for DataStore's events
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState({ currentSheet: DataStore.getCurrentSheet() });
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const sheet = this.state.currentSheet;

        return (
            <section className="participants-page">
                <h1>{ t('lang.participant_plural') }</h1>
                <ParticipantList sheet={sheet}/>
                <ParticipantAddForm participants={sheet.participants} />
                <Navigation
                    prev={pages.HOME}
                    next={pages.EXPENSES} />
            </section>

        );
    }
}
