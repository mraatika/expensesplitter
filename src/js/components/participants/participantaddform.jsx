'use strict';

import React from 'react';
import ActionCreator from '../../actions/dataactioncreators';
import _ from 'lodash';
import {t} from '../../dictionary/dictionary';
import {MessageContainer} from '../common/messagecontainer.jsx';

const defaultState = Object.freeze({
    participantName: '',
    errorText: ''
});

export class ParticipantAddForm extends React.Component {

    constructor() {
        super();
        this.state = this.getDefaultState();
    }

    getDefaultState() {
        return Object.assign({}, defaultState);
    }

    validate(participantName) {
        if (_.find(this.props.participants, (participant => participant.name === participantName))) {
            return `${t('error.participant.name.duplicate')} ${participantName}`;
        }
    }

    handleParticipantNameChange(e) {
        this.setState({ participantName: e.target.value });
    }

    handleFormSubmit(e) {
        var self = this;
        var name = this.state.participantName;
        var error;

        e.preventDefault();

        name = name || this.refs.participantName.getAttribute('placeholder');

        error = this.validate(name);

        if (error) {
            this.setState({ errorText: error }, function() {
                self._onAfterStateChange();
                self.refs.errorMessageContainer.open();
            });
            return;
        }

        this.setState(this.getDefaultState(), this._onAfterStateChange);

        ActionCreator.addParticipant({ name: name });
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit.bind(this)}>

                <MessageContainer ref="errorMessageContainer" type="danger">
                    {this.state.errorText}
                </MessageContainer>

                <div className="row">

                    <label htmlFor="participant-name">{ t('lang.participant_plural') }:</label>
                    <input
                        type="text"
                        ref="participantName"
                        id="participant-name"
                        autoFocus={true}
                        className={ 'participant-name u-full-width' + (this.state.errorText ? ' error' : '')}
                        value={this.state.participantName}
                        placeholder={ t('lang.participant') + ' ' + (this.props.participants.length + 1)}
                        onChange={this.handleParticipantNameChange.bind(this)} />

                    <button
                        className="button-primary u-full-width"
                        type="submit">
                        <i className="fa fa-plus fa-lg fa-fw" />
                        { t('participants.add_participant') }
                    </button>
                </div>
            </form>
        );
    }

    _onAfterStateChange() {
        this.refs.participantName.focus();
        this.refs.errorMessageContainer.close();
    }
}
