import {expect} from 'chai';
import sinon from 'sinon';

describe('ValidatedInput', () => {
    const jsdom = require('mocha-jsdom');

    let ValidatedInput;
    let React;
    let TestUtils;

    jsdom();

    before(() => {
        React = require('react');
        TestUtils = require('react-testutils-additions');
        ValidatedInput = require('../../../src/js/components/common/validatedinput.jsx').default;
    });

    describe('Initialization', () => {
        var consoleErrorStub;

        beforeEach(() => {
            consoleErrorStub = sinon.spy(console, 'error');
        });

        afterEach(() => {
            console.error.restore();
        });

        it('should require a schema', () => {
            React.createElement(ValidatedInput);
            expect(consoleErrorStub.firstCall.args[0]).to.equal('Warning: Failed propType: Required prop `schema` was not specified in `ValidatedInput`.');
        });

        it('should require schema to be an object', () => {
            React.createElement(ValidatedInput, { schema: 'schema'});
            expect(consoleErrorStub.firstCall.args[0]).to.equal('Warning: Failed propType: Invalid prop `schema` of type `string` supplied to `ValidatedInput`, expected `object`.');
        });

        /*
        @FIXME: not working (no calls to console.error) for some reason
        it('should require a name property', () => {
            React.createElement(ValidatedInput, { schema: {} });
            expect(consoleErrorStub.firstCall.args[0]).to.equal('Warning: Failed propType: Required prop `name` was not specified in `ValidatedInput`.');
        });
        */

        it('should require name property to be a string', () => {
            React.createElement(ValidatedInput, { schema: {}, name: 123 });
            expect(consoleErrorStub.firstCall.args[0]).to.equal('Warning: Failed propType: Invalid prop `name` of type `number` supplied to `ValidatedInput`, expected `string`.');
        });

        it('should have default success and fail properties', () => {
            var field = React.createElement(ValidatedInput, { schema: {}, name: 'testfield' });
            expect(field.props.success).not.to.be.undefined;
            expect(field.props.fail).not.to.be.undefined;
            expect(typeof field.props.success).to.equal('function');
            expect(typeof field.props.fail).to.equal('function');
        });

        it('should require success property to be a function', () => {
            React.createElement(ValidatedInput, { schema: {}, name: '', success: 1 });
            expect(consoleErrorStub.firstCall.args[0]).to.equal('Warning: Failed propType: Invalid prop `success` of type `number` supplied to `ValidatedInput`, expected `function`.');
        });

        it('should require fail property to be a function', () => {
            React.createElement(ValidatedInput, { schema: {}, name: '', fail: 1 });
            expect(consoleErrorStub.firstCall.args[0]).to.equal('Warning: Failed propType: Invalid prop `fail` of type `number` supplied to `ValidatedInput`, expected `function`.');
        });

        it('should pass given attributes to the actual input field', () => {
            let name = 'testfield';
            let field = TestUtils.renderIntoDocument(<ValidatedInput schema={{ [name]: {}}} name={name} type="number" />);
            expect(field.refs.inputField.type).to.equal('number');
        });
    });

    describe('Events', () => {
        let page = {};
        let renderField = (events, spy) => {
            let name = 'testfield';
            let validatedInput = TestUtils.renderIntoDocument(
                <ValidatedInput
                    schema={{[name]: {}}}
                    name={name}
                    success={spy}
                    events={events}/>
            );

            page.input = validatedInput.refs.inputField;

            return validatedInput;
        };


        it('should bind change event to a success callback', () => {
            let spy = sinon.spy();
            let value = 'abc';
            renderField({ change: true }, spy);

            page.input.value = value;
            TestUtils.Simulate.change(page.input);
            expect(spy.called).to.equal(true);
        });

        it('should bind blur event to a success callback', () => {
            let spy = sinon.spy();
            let value = 'abc';
            renderField({ blur: true }, spy);

            page.input.value = value;
            TestUtils.Simulate.blur(page.input);
            expect(spy.called).to.equal(true);
        });

        it('should bind all given events to a success callback', () => {
            let spy = sinon.spy();
            let value = 'abc';
            renderField({ change: true, blur: true }, spy);

            page.input.value = value;
            TestUtils.Simulate.blur(page.input);
            TestUtils.Simulate.change(page.input);
            expect(spy.callCount).to.equal(2);
        });

        it('should call success callback with field\' s name and value', () => {
            let spy = sinon.spy();
            let value = 'abc';
            let field = renderField({ blur: true }, spy);

            page.input.value = value;
            TestUtils.Simulate.blur(page.input);
            expect(spy.calledWithExactly(field.props.name, value)).to.equal(true);
        });
    });

    describe('Validation', function () {
        var page = {};
        var renderField = (successSpy, failSpy, props = {}, schema = {type: 'string', required: true}) => {
            let propertySchema = { 'testfield': schema };
            let validatedInput = TestUtils.renderIntoDocument(
                <ValidatedInput
                    {...props}
                    type="number"
                    schema={propertySchema}
                    name={'testfield'}
                    success={successSpy || (() => {})}
                    fail={failSpy || (() => {})}
                    events={{change: true}}/>
            );

            page.input = validatedInput.refs.inputField;

            return validatedInput;
        };

        it('should not call success callback when validation fails', () => {
            let spy = sinon.spy();
            renderField(spy);
            page.input.value = '';
            TestUtils.Simulate.change(page.input);
            expect(spy.called).to.equal(false);
        });

        it('should call fail callback when validation fails', () => {
            let spy = sinon.spy();
            let value = '';
            let schema = {
                type: 'string',
                required: true
            };
            let field = renderField(null,spy, {}, schema);
            page.input.value = value;
            TestUtils.Simulate.change(page.input);
            expect(spy.called).to.equal(true);
            expect(spy.calledWithExactly(field.props.name, value, true)).to.equal(true);
        });

        it('should mark field with an error class when validation fails', () => {
            let value = '';
            renderField();
            page.input.value = value;
            TestUtils.Simulate.change(page.input);
            expect(page.input.className.indexOf('error')).not.to.equal(-1);
        });

        it('should keep class names passed in props along with the error class', () => {
            let value = '';
            let className = 'abc';
            renderField(null, null, { className: className });
            page.input.value = value;
            TestUtils.Simulate.change(page.input);
            expect(page.input.className.indexOf('error')).not.to.equal(-1);
            expect(page.input.className.indexOf(className)).not.to.equal(-1);
        });

        it('should derive input node\'s validation related properties from the schema', () => {
            var schema = {
                type: 'number',
                required: true,
                min: 1,
                max: 3
            };
            renderField(null, null, {}, schema);
            expect(page.input.props.required).to.equal(schema.required);
            expect(page.input.props.min).to.equal(schema.min);
            expect(page.input.props.max).to.equal(schema.max);
        });
    });
});