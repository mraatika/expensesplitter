import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {SET_SETTINGS} from 'client/stores/settingsreducer';

describe('Reducer:SettingsReducer', function () {

    const storageSetAllSpy = sinon.spy();
    const storageGetAllStub = sinon.stub();
    let reducer;

    // block call to the actual implementation
    proxyquire.noCallThru();
    // do not cache mocked modules (affects other tests)
    proxyquire.noPreserveCache();

    before(() => reducer = proxyquire('client/stores/settingsreducer', {
        'client/factory/storagefactory': () => { return { setAll: storageSetAllSpy, getAll: storageGetAllStub };}
    }).default);

    afterEach(() => {
        storageSetAllSpy.reset();
        storageGetAllStub.reset().returns({});
    });

    describe('initial state', function () {

        it('should return initial state from storage', function () {
            const savedState = { a: 1 };

            storageGetAllStub.returns(savedState);
            expect(reducer(undefined, {})).to.deep.equal(savedState);
        });
    });

    describe('Setting new settings', function () {
        const settings = { lang: 'en' };
        const action = { type: SET_SETTINGS, settings };

        it('should add settings to state', function () {
            expect(reducer({}, action).lang).to.equal(settings.lang);
        });

        it('should extend current state', function () {
            const initialState = { prop: '1' };
            const res = reducer(initialState, action);
            expect(res.prop).to.be.defined;
            expect(res.lang).to.be.defined;
        });

        it('should return a new object', function () {
            // should not same object as the initial state object
            expect(reducer(settings, action)).not.to.equal(settings);
        });

        it('should save changes to storage', function () {
            expect(reducer({}, action));
            expect(storageSetAllSpy).to.have.been.calledWithExactly(action.settings);
        });
    });
});