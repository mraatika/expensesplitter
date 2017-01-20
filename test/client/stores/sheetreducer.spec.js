import {expect} from 'chai';
import {omit} from 'ramda';
import reducer, {
    createSheet,
    saveSheet,
    removeSheet,
    fetchSheet,
    updateSheet,
    CREATE_SHEET,
    LOAD_SHEET,
    LOAD_SHEET_SUCCESS,
    SAVE_SHEET,
    SAVE_SHEET_FAIL,
    SAVE_SHEET_SUCCESS,
    UPDATE_SHEET,
    REMOVE_SHEET,
    REMOVE_SHEET_FAIL
} from 'client/stores/sheetreducer';
import {ADD_EXPENSE, REMOVE_EXPENSE} from 'client/stores/expensesreducer';
import {ADD_PARTICIPANT, REMOVE_PARTICIPANT} from 'client/stores/participantsreducer';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import sheetFactory from 'client/factory/sheetfactory';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Reducer:SheetReducer', function () {

    describe('Initial state', function () {
        it('should initially be an object', function () {
            const res = reducer(undefined, {});
            expect(res).to.be.an('object');
        });

        it('should have dirty property as false', function () {
            expect(reducer(undefined, {}).dirty).not.to.be.ok;
        });

        it('should return same object when action is not handled', function () {
            const initialState = {};
            expect(reducer(initialState, {})).to.equal(initialState);
        });
    });

    describe('Creating a sheet', function () {
        const sheet = { name: 'testsheet' };
        const action = { type: CREATE_SHEET, sheet };

        it('should create new sheet', function () {
            const res = reducer({}, action);
            expect(res.name).to.equal(sheet.name);
            expect(res.id).to.be.defined;
        });

        it('should mark sheet dirty', function () {
            const res = reducer({}, action);
            expect(res.dirty).to.be.ok;
        });

        it('should not return same object', function () {
            const initialState = { ...sheet, dirty: true };
            expect(reducer(sheet, action)).not.to.equal(initialState);
        });
    });

    describe('Updating', function () {
        const initialState = { dirty: false, id: '123', name: 'testsheet1', participants: [] };
        const update = { id: '123', name: 'testsheet2', prop: 'abc' };
        const action = { type: UPDATE_SHEET, update };

        describe('sheet', function () {
            it('should update sheet with given props', function () {
                const sheet = reducer(initialState, action);
                expect(sheet.id).to.equal(initialState.id);
                expect(sheet.name).to.equal(update.name);
                expect(sheet.prop).to.equal(update.prop);
            });

            it('should mark sheet dirty', function () {
                expect(reducer(initialState, action).dirty).to.be.ok;
            });

            it('should not return same object', function () {
                expect(reducer(initialState, action)).not.to.equal(initialState);
            });
        });

        describe('Sheet\'s participants', function () {
            const participant = { id: '1', name: 'testname' };

            describe('add', function () {
                it('should mark sheet dirty', function () {
                    const action = { type: ADD_PARTICIPANT, participant };
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });

            describe('remove', function () {
                it('should mark sheet dirty', function () {
                    const action = { type: REMOVE_PARTICIPANT, participant };
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });
        });

        describe('Sheet\'s expenses', function () {
            const expense = { id: '1', name: 'testexpense' };

            describe('add', function () {
                const action = { type: ADD_EXPENSE, expense };
                it('should mark sheet dirty', function () {
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });

            describe('remove', function () {

                it('should mark sheet dirty', function () {
                    const action = { type: REMOVE_EXPENSE, expense };
                    expect(reducer(initialState, action).dirty).to.be.ok;
                });
            });
        });

    });

    describe('Load sheet success', function () {
        const sheet = { id: '123', name: 'testsheet1' };
        const action = { type: LOAD_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should set the received sheet to the state', function () {
            const expected = { ...sheet, dirty: false };
            expect(reducer({}, action)).to.deep.equal(expected);
        });

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).not.to.be.ok;
        });

        it('should not return the same object', function () {
            const initialState = { dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Save sheet success', function () {
        const sheet = { id: '123', name: 'testsheet1' };
        const action = { type: SAVE_SHEET_SUCCESS, payload: { data: { sheet }}};

        it('should set the received sheet to the state', function () {
            const expected = { ...sheet, dirty: false };
            expect(reducer({}, action)).to.deep.equal(expected);
        });

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).not.to.be.ok;
        });

        it('should not return the same object', function () {
            const initialState = { dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });
    });

    describe('Save sheet error', function () {
        const action = { type: SAVE_SHEET_FAIL };

        it('should set sheet not dirty', function () {
            expect(reducer({}, action).dirty).to.be.ok;
        });

        it('should not return the same object if value changes', function () {
            const initialState = { dirty: false };
            expect(reducer(initialState, action)).not.to.equal(initialState);
        });

        it('should return the same object if value does not change', function () {
            const initialState = { dirty: true };
            expect(reducer(initialState, action)).to.equal(initialState);
        });
    });

    describe('ActionCreators:Sheet', function () {

        describe('create', function () {
            it('should throw if called without sheet', function () {
                expect(() => createSheet()).to.throw();
            });

            it('should have type CREATE_SHEET', function () {
                const sheet = { name:'testsheet' };
                expect(createSheet(sheet).type).to.equal(CREATE_SHEET);
            });

            it('should have sheet as payload', function () {
                const sheet = { name:'testsheet' };
                const payload = createSheet(sheet);
                const expected = omit(['id', 'adminKey', 'createdOn'], sheetFactory(sheet));
                const withoutRnds = omit(['id', 'adminKey', 'createdOn'], payload.sheet);

                expect(payload.sheet.id).to.be.ok;
                expect(payload.sheet.adminKey).to.be.ok;
                expect(withoutRnds).to.deep.equal(expected);
            });
        });

        describe('fetch', function () {
            it('should throw if called without sheet id', function () {
                expect(() => fetchSheet()).to.throw();
            });

            it('should throw if called with invalid sheet id', function () {
                expect(() => fetchSheet(1)).to.throw();
            });

            it('should dispatch an event', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: {}, settings });

                const res = fetchSheet(sheet.id)(store.dispatch, store.getState);
                expect(res.type).to.equal(LOAD_SHEET);
                expect(res.payload.request.url).to.contain(`sheet/${sheet.id}`);
                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });
        });

        describe('save', function () {
            it('should throw if called without a sheet', function () {
                expect(() => saveSheet()).to.throw();
            });

            it('should throw if called with an invalid sheet', function () {
                expect(() => saveSheet('a')).to.throw();
            });

            it('should return undefined if sheet is not changed (dirty)', function () {
                const sheet = { id: '1', name:'testsheet', settings: {} };
                const settings = { language: 'en' };
                const store = mockStore({ sheet: { dirty: false }, settings });

                const res = saveSheet(sheet)(store.dispatch, store.getState);
                expect(res).not.to.be.defined;
            });

            it('should return a post action when the sheet is not yet saved to the server', function () {
                const sheet = { id: '1', name:'testsheet', settings: {}, dirty: true };
                const participants = [ { id: 1 }, { id: 2 } ];
                const expenses = [ { id: 3 }, { id: 4 } ];
                const settings = { language: 'en' };
                const store = mockStore({ expenses, participants, settings });

                const res = saveSheet(sheet)(store.dispatch, store.getState);
                expect(res.type).to.equal(SAVE_SHEET);
                expect(res.payload.request.method).to.equal('POST');
                expect(res.payload.request.url).to.equal('/sheet');
                expect(res.payload.request.data.sheet.id).to.equal(sheet.id);
                expect(res.payload.request.data.sheet.name).to.equal(sheet.name);
                expect(res.payload.request.data.sheet.expenses).to.deep.equal(expenses);
                expect(res.payload.request.data.sheet.participants).to.deep.equal(participants);

                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });

            it('should return a put action when the sheet should be updated', function () {
                const sheet = { id: '1', name:'testsheet', settings: {}, lastSavedOn: new Date(), dirty: true };
                const participants = [ { id: 1 }, { id: 2 } ];
                const expenses = [ { id: 3 }, { id: 4 } ];
                const settings = { language: 'en' };
                const store = mockStore({ expenses, participants, settings });

                const res = saveSheet(sheet)(store.dispatch, store.getState);
                expect(res.type).to.equal(SAVE_SHEET);
                expect(res.payload.request.method).to.equal('PUT');
                expect(res.payload.request.url).to.equal('/sheet/' + sheet.id);
                expect(res.payload.request.data.sheet.id).to.equal(sheet.id);
                expect(res.payload.request.data.sheet.name).to.equal(sheet.name);
                expect(res.payload.request.data.sheet.expenses).to.deep.equal(expenses);
                expect(res.payload.request.data.sheet.participants).to.deep.equal(participants);

                expect(res.payload.request.headers).to.have.keys('Accept-Language');
                expect(res.payload.request.headers['Accept-Language']).to.equal(settings.language);
            });
        });

        describe('update', function () {
            const sheet = { id: '1', name:'testsheet', settings: {}, lastSavedOn: new Date(), dirty: true };

            it('should throw if called without a sheet', function () {
                expect(() => updateSheet()).to.throw();
            });

            it('should throw if called with an invalid sheet', function () {
                expect(() => updateSheet('a')).to.throw();
            });

            it('should return an action with sheet and an update object', function () {
                const update = { prop: 1 };
                const res = updateSheet(sheet, update);

                expect(res.type).to.equal(UPDATE_SHEET);
                expect(res.sheet).to.equal(sheet);
                expect(res.update).to.equal(update);
            });

            it('should update with empty object when second argument is undefined', function () {
                const res = updateSheet(sheet);

                expect(res.update).to.be.an('object');
                expect(res.update).to.be.empty;
            });
        });

        describe('delete', function () {
            const sheet = { id: '1', adminKey: '123' };

            it('should throw if called without a sheet', function () {
                expect(() => removeSheet()).to.throw();
            });

            it('should throw if called with an invalid sheet', function () {
                expect(() => removeSheet('a')).to.throw();
            });

            it('should dispatch an error if adminKey is not provided', function () {
                const store = mockStore({ sheet: {}, settings: {} });

                const res = removeSheet(sheet)(store.dispatch);
                expect(res.type).to.equal(REMOVE_SHEET_FAIL);
                expect(res.error.client).to.be.ok;
                expect(res.error.message).to.be.a('string');
            });

            it('should dispatch an error if adminKey does not match the sheet\'s adminKey', function () {
                const store = mockStore({ sheet: {}, settings: {} });

                const res = removeSheet(sheet, 'invalidkey')(store.dispatch);
                expect(res.type).to.equal(REMOVE_SHEET_FAIL);
                expect(res.error.client).to.be.ok;
                expect(res.error.message).to.be.a('string');
            });

            it('should dispatch a delete api action if adminKey matches the sheet\'s adminKey', function () {
                const store = mockStore({ sheet: {}, settings: { language: 'fi' } });

                const res = removeSheet(sheet, sheet.adminKey)(store.dispatch, store.getState);
                expect(res.type).to.equal(REMOVE_SHEET);
                expect(res.payload.request.method).to.equal('DELETE');
                expect(res.payload.request.url).to.equal(`/sheet/${sheet.id}`);
                expect(res.payload.request.headers['Accept-Language']).to.equal('fi');
                expect(res.payload.request.headers['X-Admin-Token']).to.equal(sheet.adminKey);
            });
        });
    });
});