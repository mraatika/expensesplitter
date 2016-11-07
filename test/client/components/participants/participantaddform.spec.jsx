import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {t} from 'common/dictionary/dictionary';
import ParticipantAddForm from 'components/participants/participantaddform.jsx';
import MessageContainer from 'client/components/common/messagecontainer.jsx';
import {componentRenderer, componentMounter} from '../../support/testhelper';

describe('Component:ParticipantAddForm', function() {

    const participants =  [
        { name: 'Kake' },
        { name: 'Make' },
        { name: 'Pera' }
    ];

    const defaultProps = {
        participants,
        onFormSubmit: new Function()
    };

    const renderComponent = componentRenderer(ParticipantAddForm, defaultProps);
    const mountComponent = componentMounter(ParticipantAddForm, defaultProps);

    describe('Initial state', function () {
        let component;

        beforeEach(() => component = renderComponent());

        it('should not display error span by default', function() {
            const error = component.find(MessageContainer);
            expect(error).to.have.style('display', 'none');
        });

        it('should not display name input with error class', function () {
            const field = component.find('#participant-name');
            expect(field).not.to.have.className('error');
        });

        it('text input field should have placeholder containing a default value', function () {
            const expectation = `Participant ${participants.length + 1}`;
            const field = component.find('#participant-name');
            expect(field.prop('placeholder')).to.equal(expectation);
        });
    });

    describe('Creating participants', function () {
        let component;
        let onFormSubmitSpy = sinon.spy();

        beforeEach(() => component = mountComponent({ onFormSubmit: onFormSubmitSpy }));
        afterEach(() => onFormSubmitSpy.reset());

        it('should call props.onFormSubmit when add button is clicked', function () {
            const participant = { name: 'Seppo' };

            component.find('#participant-name').simulate('change', { target: { value: participant.name }});

            component.simulate('submit', { preventDefault: new Function() });

            expect(onFormSubmitSpy).to.have.been.calledWith(participant);
        });

        it('should use placeholder as name when the field is left empty', function () {
            const placeHolder = `Participant ${participants.length + 1}`;
            const expected = { name: placeHolder };

            component.simulate('submit', { preventDefault: new Function() });

            expect(onFormSubmitSpy).to.have.been.calledWith(expected);
        });

        it('should set initial state after successfull create', function () {
            const participant = { name: 'Jake' };

            component.find('#participant-name').simulate('change', { target: { value: participant.name }});

            component.simulate('submit', { preventDefault: new Function() });

            expect(component.find(MessageContainer)).to.have.style('display', 'none');
            expect(component.find('#participant-name')).not.to.have.className('error');
        });
    });

    describe('Errors', function () {
        let component;
        let onFormSubmitSpy = sinon.spy();

        beforeEach(() => component = renderComponent({ onFormSubmit: onFormSubmitSpy }));
        afterEach(() => onFormSubmitSpy.reset());

        it('should display an error text when trying to add participant with same name twice', function () {
            const name = participants[0].name;
            const expectedErrorText = t('error.participant.name.duplicate');

            component.find('#participant-name').simulate('change', { target: { value: name }});

            component.simulate('submit', { preventDefault: new Function() });

            expect(component.find(MessageContainer).dive()).to.have.style('display', 'block');
            expect(component.find(MessageContainer).dive()).to.contain.text(`${expectedErrorText} ${name}`);
        });

        it('should not call submit callback if invalid', function () {
            const name = participants[0].name;

            component.find('#participant-name').simulate('change', { target: { value: name }});

            component.simulate('submit', { preventDefault: new Function() });

            expect(onFormSubmitSpy).not.to.have.been.called;
        });

        it('should add an error class to the name input', function () {
            const _component = mountComponent();
            const name = participants[0].name;
            const field = _component.find('#participant-name');

            field.simulate('change', { target: { value: name }});

            _component.simulate('submit', { preventDefault: new Function() });

            expect(field).to.have.className('error');
        });
    });
});