import React from 'react';
import {expect} from 'chai';
import {NumberUtils} from 'client/util/utils';
import Share from 'client/components/shares/share.jsx';
import {componentRenderer} from '../../support/testhelper';

describe('Component:Share', function() {

    const shareModel = {
        participantName: 'Seppo',
        amount: 200.32123,
        balance: -500.23958
    };

    const renderComponent = componentRenderer(Share, { share: shareModel });

    let component;

    beforeEach(() => component= renderComponent());

    it('should display participant\'s name', function() {
        const label = component.find('.share-participant');
        expect(label).to.have.text(shareModel.participantName);
    });

    it('should display participant\'s share amount rounded to one decimal', function() {
        const label = component.find('.share-share-amount');
        expect(label).to.have.text('' + (NumberUtils.round(shareModel.amount, 1)));
    });

    it('should display participant\'s balance rounded to one decimal', function() {
        const label = component.find('.share-balance');
        expect(label).to.have.text('' + (NumberUtils.round(shareModel.balance, 1)));
    });

    it('should add class "negative" to balance label if participant\'s balance is negative', function() {
        const label = component.find('.share-balance');
        expect(label).to.have.className('negative');
        expect(label).not.to.have.className('positive');
    });

    it('should add class "positive" to balance label if participant\'s balance is positive', function() {
        const _component = renderComponent({ share: {...shareModel, balance: 50 }});
        const label = _component.find('.share-balance');
        expect(label).to.have.className('positive');
        expect(label).not.to.have.className('negative');
    });

    it('should not add classes to balance label if participant\'s balance is 0', function() {
        const _component = renderComponent({ share: {...shareModel, balance: 0 }});
        const label = _component.find('.share-balance');
        expect(label).not.to.have.className('positive');
        expect(label).not.to.have.className('negative');
    });
});