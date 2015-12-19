jest.autoMockOff();

import React from 'react';
import TestUtils from 'react-testutils-additions';

const ParticipantAddForm = require('../../../components/participants/participantaddform.jsx').default;
const dictionary = require('../../../dictionary/dictionary');

describe('Component:ParticipantAddForm', function() {
    var participantAddForm;
    var participants;

    beforeEach(function () {
        participants = [
            { name: 'Kake' },
            { name: 'Make' },
            { name: 'Pera' }
        ];

        participantAddForm = TestUtils.renderIntoDocument(
            <ParticipantAddForm participants={participants} onFormSubmit={jasmine.createSpy()}/>
        );
    });

    it('should not display error span by default', function() {
        // verify name label value
        var errorTextSpan = TestUtils.findRenderedDOMComponentWithClass(participantAddForm, 'danger');
        expect(errorTextSpan.style.display).toEqual('none');
    });

    it('text input field should have placeholder containing a default value', function () {
        var expectation = 'Participant ' + (participants.length + 1);
        var nameField = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'input');
        expect(nameField.getAttribute('placeholder')).toEqual(expectation);
    });

    it('should call props.onFormSubmit when add button is clicked', function () {
        var participant = { name: 'Seppo' };

        var nameField = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'input');
        nameField.value = participant.name;
        TestUtils.Simulate.change(nameField);

        // Simulate a click and verify that the action creator is called
        var form = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'form');
        TestUtils.Simulate.submit(form);

        expect(participantAddForm.props.onFormSubmit).toHaveBeenCalledWith(participant);
    });

    it('should use placeholder as name when the field is left empty', function () {
        var nameField = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'input');
        var placeHolder = nameField.getAttribute('placeholder');
        var expected = { name: placeHolder };

        // Simulate a click and verify that the action creator is called
        var form = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'form');
        TestUtils.Simulate.submit(form);

        expect(participantAddForm.props.onFormSubmit).toHaveBeenCalledWith(expected);
    });


    it('should display an error text when trying to add participant with same name twice', function () {
        var name = participants[0].name;
        var nameField = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'input');
        nameField.value = name;
        TestUtils.Simulate.change(nameField);

        // Simulate a click and verify that the action creator is called
        var form = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'form');
        TestUtils.Simulate.submit(form);

        var errorTextSpan = TestUtils.findRenderedDOMComponentWithClass(participantAddForm, 'danger');
        var expectedErrorText = dictionary.t('error.participant.name.duplicate');

        expect(errorTextSpan.className.indexOf('hidden')).toEqual(-1);
        expect(errorTextSpan.textContent).toEqual(expectedErrorText + ' ' + name);
    });
});