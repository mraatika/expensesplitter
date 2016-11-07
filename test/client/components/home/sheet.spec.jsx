import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {t} from 'common/dictionary/dictionary';
import {DateUtils} from 'util/utils';
import TrashButton from 'client/components/common/trashbutton.jsx';
import Sheet from 'components/home/sheet.jsx';
import {componentRenderer} from '../../support/testhelper';

describe('Component:Sheet', function() {

    const defaultProps = {
        sheet: {
            id: 'id1',
            name: 'Seppo',
            createdOn: new Date(1,0,2015)
        },
        isCurrentSheet: false
    };

    const renderComponent = componentRenderer(Sheet, defaultProps);

    describe('Initial state', function () {

        it('should render sheet\'s name', function() {
            const component = renderComponent();
            expect(component.find('.sheet-list-name')).to.have.text(defaultProps.sheet.name);
        });

        it('should render sheet\'s name', function() {
            const component = renderComponent();
            expect(component.find('.sheet-list-date')).to.have.text(DateUtils.format(defaultProps.sheet.createdOn, t('app.locales.date_format')));
        });
    });

    describe('Marking the current sheet', function () {
        it('should mark the current sheet with a check marker', function () {
            const component = renderComponent({ isCurrentSheet: true });
            const marker = component.find('.fa-check-circle-o');
            expect(marker).not.have.className('hidden');
        });
    });

    describe('Removing a sheet', function () {
        it('should call remove callback when remove button is clicked', function () {
            const spy = sinon.spy();
            const component = renderComponent({ onRemoveClick: spy });
            const removeButton = component.find(TrashButton);

            removeButton.simulate('click', { stopPropagation: new Function() });

            expect(spy).to.have.been.called;
            expect(spy).to.been.calledWithExactly(defaultProps.sheet);
        });
    });
});