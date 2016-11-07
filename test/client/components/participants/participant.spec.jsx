import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import Participant from 'components/participants/participant.jsx';
import TrashButton from 'client/components/common/trashbutton.jsx';
import {componentRenderer} from '../../support/testhelper';

describe('Component:Participant', function() {

    const participantModel = {
        id: 'id1',
        name: 'Seppo'
    };

    const defaultProps = {
        participant: participantModel,
        onRemoveClick: new Function()
    };

    const renderComponent = componentRenderer(Participant, defaultProps);

    describe('Rendering', function () {
        it('should render participant\'s name', function() {
            const component = renderComponent();
            const label = component.find('.participant-list-participant');
            expect(label).to.contain.text(participantModel.name);
        });
    });

    describe('Removing a participant', function () {
        it('should call given callback when remove button is clicked', function () {
            const spy = sinon.spy();
            const component = renderComponent({ onRemoveClick: spy });
            const button = component.find(TrashButton);
            button.simulate('click');
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWithExactly(participantModel);
        });
    });
});