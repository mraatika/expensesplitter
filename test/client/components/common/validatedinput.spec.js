import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {componentRenderer, componentMounter} from '../../support/testhelper';

describe('Component:ValidatedInput', () => {

    proxyquire.noPreserveCache();

    const validatorStub = sinon.stub();
    const ValidatedInput = proxyquire('components/common/validatedinput.jsx', {
        'common/validation/validator' : {
            validateProperty: validatorStub
        }
    }).default;

    const defaultProps = { schema: { 'testfield': {} }, name: 'testfield' };

    const renderComponent = componentRenderer(ValidatedInput, defaultProps);
    const mountComponent = componentMounter(ValidatedInput, defaultProps);

    describe('Initialization', () => {

        it('should pass type property to the actual input field', () => {
            const component = renderComponent({ type: 'number'});
            expect(component.find('input').prop('type')).to.equal('number');
        });

        it('should pass type property to the actual input field', () => {
            const component = renderComponent({ step: '1'});
            expect(component.find('input').prop('step')).to.equal('1');
        });
    });

    describe('Events', () => {
        it('should bind change event to a success callback', () => {
            const spy = sinon.spy();
            const value = 'abc';
            const component = renderComponent({ events: { change: true }, success: spy });
            const input = component.find('input');

            input.simulate('change', { target: { value }});

            expect(spy).to.have.been.calledWithExactly('testfield', value);
        });

        it('should bind blur event to a success callback', () => {
            let spy = sinon.spy();
            let value = 'abc';
            const component = renderComponent({ events: { blur: true }, success: spy });
            const input = component.find('input');

            input.simulate('change', { target: { value }});

            input.simulate('blur', { target: { value }});

            expect(spy).to.have.been.calledWithExactly('testfield', value);
        });

        it('should bind all given events to a success callback', () => {
            let spy = sinon.spy();
            let value = 'abc';
            const component = renderComponent({ events: { change: true, blur: true }, success: spy });
            const input = component.find('input');

            input.simulate('change', { target: { value }});
            input.simulate('blur', { target: { value }});

            expect(spy).to.have.been.calledTwice;
        });
    });

    describe('Validation', function () {
        const schema = {type: 'string', required: true};
        const propertySchema = { 'testfield': schema };
        const successSpy = sinon.spy();
        const failSpy = sinon.spy();
        const defaultProps = {
            type: 'number',
            schema: propertySchema,
            success: successSpy,
            fail: failSpy,
            events: { change:true }
        };

        let component;

        beforeEach(() => component = renderComponent(defaultProps));
        afterEach(() => {
            successSpy.reset();
            failSpy.reset();
        });

        it('should not call success callback when validation fails', () => {
            const input = component.find('input');
            validatorStub.returns({ name: true });
            input.simulate('change', { target: { value: '' }});
            expect(successSpy).not.to.have.been.called;
        });

        it('should call fail callback when validation fails', () => {
            const input = component.find('input');
            const error = { name: true };
            validatorStub.returns(error);
            input.simulate('change', { target: { value: '' }});
            expect(failSpy).to.have.been.calledWithExactly('testfield', '', error);
        });

        it('should mark field with an error class when validation fails', () => {
            const _component = mountComponent(defaultProps);
            const input = _component.find('input');
            const error = { name: true };
            validatorStub.returns(error);
            input.simulate('change', { target: { value: '' }});
            expect(input).to.have.className('error');
        });

        it('should keep class names passed in props along with the error class', () => {
            const className = 'abc';
            const _component = mountComponent({...defaultProps, className });
            const input = _component.find('input');
            const error = { name: true };

            validatorStub.returns(error);
            input.simulate('change', { target: { value: '' }});

            expect(input).to.have.className('error');
            expect(input).to.have.className(className);
        });

        it('should derive input node\'s validation related properties from the schema', () => {
            const schema = {
                testfield: {
                    type: 'number',
                    required: true,
                    min: 1,
                    max: 3
                }
            };

            const _component = renderComponent({...defaultProps, schema });
            const input = _component.find('input');

            expect(input).to.have.prop('required');
            expect(input).to.have.prop('min', schema.min);
            expect(input).to.have.prop('max', schema.max);
        });
    });
});