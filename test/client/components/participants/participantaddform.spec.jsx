import {expect} from 'chai';
import sinon from 'sinon';
import {t} from 'dictionary/dictionary';

describe('Component:ParticipantAddForm', function() {
    const jsdom = require('mocha-jsdom');
    const page = {};

    let React;
    let TestUtils;
    let ParticipantAddForm;
    let participants;
    let participantAddForm;

    jsdom();

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        ParticipantAddForm = require('components/participants/participantaddform.jsx').default;
    });

    beforeEach(function () {
        participants = [
            { name: 'Kake' },
            { name: 'Make' },
            { name: 'Pera' }
        ];

        participantAddForm = TestUtils.renderIntoDocument(
            <ParticipantAddForm participants={participants} onFormSubmit={sinon.spy()}/>
        );

        page.errorTextSpan = TestUtils.findRenderedDOMComponentWithClass(participantAddForm, 'danger');
        page.nameField = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'input');
        page.form = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'form');
    });

    describe('Initial state', function () {
        it('should not display error span by default', function() {
            // verify name label value
            expect(page.errorTextSpan.style.display).to.equal('none');
        });

        it('should not display name input with error class', function () {
            expect(page.nameField.className.indexOf('error')).to.equal(-1);
        });

        it('text input field should have placeholder containing a default value', function () {
            var expectation = 'Participant ' + (participants.length + 1);
            var nameField = TestUtils.findRenderedDOMComponentWithTag(participantAddForm, 'input');
            expect(nameField.getAttribute('placeholder')).to.equal(expectation);
        });
    });

    describe('Creating participants', function () {
        it('should call props.onFormSubmit when add button is clicked', function () {
            var participant = { name: 'Seppo' };

            page.nameField.value = participant.name;
            TestUtils.Simulate.change(page.nameField);

            TestUtils.Simulate.submit(page.form);

            expect(participantAddForm.props.onFormSubmit.calledWith(participant)).to.be.ok;
        });

        it('should use placeholder as name when the field is left empty', function () {
            var placeHolder = page.nameField.getAttribute('placeholder');
            var expected = { name: placeHolder };

            TestUtils.Simulate.submit(page.form);

            expect(participantAddForm.props.onFormSubmit.calledWith(expected)).to.be.ok;
        });

        it('should set initial state after successfull create', function () {
            var participant = { name: 'Jake' };

            page.nameField.value = participant.name;
            TestUtils.Simulate.change(page.nameField);

            TestUtils.Simulate.submit(page.form);

            expect(page.nameField.getAttribute('placeholder')).to.equal('Participant ' + (participantAddForm.props.participants.length + 1));
            expect(page.errorTextSpan.style.display).to.equal('none');
            expect(page.nameField.className.indexOf('error')).to.equal(-1);
        });
    });

    describe('Errors', function () {
        it('should display an error text when trying to add participant with same name twice', function () {
            var name = participants[0].name;

            page.nameField.value = name;
            TestUtils.Simulate.change(page.nameField);

            TestUtils.Simulate.submit(page.form);

            var expectedErrorText = t('error.participant.name.duplicate');

            expect(page.errorTextSpan.className.indexOf('hidden')).to.equal(-1);
            expect(page.errorTextSpan.textContent).to.equal(expectedErrorText + ' ' + name);
        });

        it('should add an error class to the name input', function () {
            var name = participants[0].name;

            page.nameField.value = name;
            TestUtils.Simulate.change(page.nameField);

            TestUtils.Simulate.submit(page.form);

            expect(page.nameField.className.indexOf('error')).not.to.equal(-1);
        });
    });
});