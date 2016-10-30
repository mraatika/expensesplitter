import sinon from 'sinon';

export default function getStubs() {
    const sandbox = sinon.sandbox.create();

    return {
        sandbox,
        dispatcher: {
            register: sandbox.stub(),
            waitFor: sandbox.stub()
        },

        validation: {
            validate: sandbox.stub().returns({})
        },

        factory: {
            create: sandbox.stub()
        },

        storage: {
            getAll: sandbox.stub(),
            get: sandbox.stub(),
            set: sandbox.stub(),
            remove: sandbox.stub(),
            save: sandbox.stub(),
            clear: sandbox.stub(),
            load: sandbox.stub()
        }
    };
}