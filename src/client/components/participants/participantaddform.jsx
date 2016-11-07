import React, {PropTypes} from 'react';
import {find} from 'lodash';
import {t} from 'common/dictionary/dictionary';
import MessageContainer from 'client/components/common/messagecontainer.jsx';

class ParticipantAddForm extends React.Component {

    constructor() {
        super();
        this.state = this._getDefaultState();
    }

    _getDefaultState() {
        return {
            participantName: '',
            errorText: ''
        };
    }

    _validate(participantName) {
        if (find(this.props.participants, (participant => participant.name === participantName))) {
            return `${t('error.participant.name.duplicate')} ${participantName}`;
        }
    }

    _handleParticipantNameChange(e) {
        this.setState({ participantName: e.target.value });
    }

    _handleFormSubmit(e) {
        e.preventDefault();

        const name = this.state.participantName || this._participantInput.getAttribute('placeholder');
        const error = this._validate(name);

        if (error) {
            this.setState({ errorText: error });
        } else {
            this.setState(this._getDefaultState());
            this.props.onFormSubmit({ name });
        }
    }

    render() {
        return (
            <form onSubmit={this._handleFormSubmit.bind(this)}>

                <MessageContainer
                    show={!!this.state.errorText}
                    closable={false}
                    type="danger">
                    {this.state.errorText}
                </MessageContainer>

                <div className="row">

                    <label htmlFor="participant-name">{ t('lang.participant_plural') }:</label>
                    <input
                        type="text"
                        ref={c => this._participantInput = c}
                        id="participant-name"
                        className={ 'participant-name u-full-width' + (this.state.errorText ? ' error' : '')}
                        value={this.state.participantName}
                        placeholder={ t('lang.participant') + ' ' + (this.props.participants.length + 1)}
                        onChange={this._handleParticipantNameChange.bind(this)} />

                    <button className="button-primary u-full-width" type="submit">
                        <i className="fa fa-plus fa-lg fa-fw" />
                        { t('participants.add_participant') }
                    </button>
                </div>
            </form>
        );
    }
}

ParticipantAddForm.defaultProps = {
    participants: [],
    onFormSubmit: () => {}
};

ParticipantAddForm.propTypes = {
    participants: PropTypes.array,
    onFormSubmit: PropTypes.func
};

export default ParticipantAddForm;