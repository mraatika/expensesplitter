import sinon from 'sinon';

export default function getStubs() {

    return {
        dispatcher: {
            register: sinon.stub(),
            waitFor: sinon.stub()
        },

        validation: {
            validate: sinon.stub().returns({})
        },

        factory: {
            create: sinon.stub()
        }
    };
}