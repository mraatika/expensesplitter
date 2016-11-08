import {expect} from 'chai';
import {t, tpl} from 'common/dictionary/dictionary';
import Constants from 'client/constants/appconstants';
import {notificationsReducer as reducer} from 'client/stores/notificationsreducer';

describe('Reducer:NotificationsReducer', function () {

    describe('initial state', function () {
        it('should return an empty array', function () {
            expect(reducer(undefined, {})).to.be.an('array');
            expect(reducer(undefined, {}).length).to.equal(0);
        });
    });

    describe('Adding a server error', function () {
        const loadSheetAction = { type: Constants.ErrorEventTypes.LOAD_SHEET, error: {}};
        const saveSheetAction = { type: Constants.ErrorEventTypes.SAVE_SHEET, error: {}};
        const removeSheetAction = { type: Constants.ErrorEventTypes.REMOVE_SHEET, error: {}};

        it('should have a type related title', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.title).to.contain(t(`errors.${loadSheetAction.type}.title`));
        });

        it('should have a general error message when connection to server fails', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.message).to.contain(t('error.server.0'));
        });

        it('should have statuscode 0 when response is not received from the server', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.children.props.children).to.equal(tpl('error.server.status_code_info', { status: 0 }));
        });

        it('should have a specified error message when a response is received from the server', function () {
            const message = 'TestErrorMessage';
            const res = reducer(undefined, {...loadSheetAction, error: { response: { data: { message }}}})[0];
            expect(res.message).to.contain(message);
        });

        it('should have a status code message when a response is received from the server', function () {
            const res = reducer(undefined, {...loadSheetAction, error: { response: { status: 404 }}})[0];
            expect(res.children.props.children).to.equal(tpl('error.server.status_code_info', { status: 404 }));
        });

        it('should have level "error"', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.level).to.equal('error');
        });

        it('should have a dismiss time', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.autoDismiss).to.be.a('number');
        });

        it('should return an error message when save sheet fails', function () {
            const res = reducer(undefined, saveSheetAction)[0];
            expect(res.title).to.contain(t(`errors.${saveSheetAction.type}.title`));
        });

        it('should return an error message when removing a sheet fails', function () {
            const res = reducer(undefined, removeSheetAction)[0];
            expect(res.title).to.contain(t(`errors.${removeSheetAction.type}.title`));
        });
    });

    describe('Adding a client error message', function () {
        const message = 'testmessage';
        const loadSheetAction = { type: Constants.ErrorEventTypes.LOAD_SHEET, error: { client: true, message }};
        const saveSheetAction = { type: Constants.ErrorEventTypes.SAVE_SHEET, error: {}};
        const removeSheetAction = { type: Constants.ErrorEventTypes.REMOVE_SHEET, error: {}};

        it('should have a title', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.title).to.contain(t(`errors.${loadSheetAction.type}.title`));
        });

        it('should have a message', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.message).to.equal(message);
        });

        it('should have level "error"', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.level).to.equal('error');
        });

        it('should have a dismiss time', function () {
            const res = reducer(undefined, loadSheetAction)[0];
            expect(res.autoDismiss).to.be.a('number');
        });

        it('should return an error message when save sheet fails', function () {
            const res = reducer(undefined, saveSheetAction)[0];
            expect(res.title).to.contain(t(`errors.${saveSheetAction.type}.title`));
        });

        it('should return an error message when removing a sheet fails', function () {
            const res = reducer(undefined, removeSheetAction)[0];
            expect(res.title).to.contain(t(`errors.${removeSheetAction.type}.title`));
        });
    });
});