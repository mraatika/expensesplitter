import {expect} from 'chai';
import * as actions from 'client/actions/uiactioncreators';
import Constants from 'client/constants/appconstants';

describe('Actions: UIActionCreators', function () {
    describe('toggle sheet dialog', function () {
        it('should dispatch an event with state', function () {
            const res = actions.toggleLoadSheetDialog(true);
            expect(res.type).to.equal(Constants.ActionTypes.TOGGLE_LOAD_SHEET_DIALOG);
            expect(res.state).to.be.ok;
        });
    });

    describe('toggle new sheet added message', function () {
        it('should dispatch an event with state', function () {
            const res = actions.toggleNewSheetAdded(true);
            expect(res.type).to.equal(Constants.ActionTypes.TOGGLE_NEW_SHEET_MESSAGE);
            expect(res.state).to.be.ok;
        });
    });

    describe('toggle settings section', function () {
        it('should dispatch event with state', function () {
            const res = actions.toggleSettingsSection(true);
            expect(res.type).to.equal(Constants.ActionTypes.TOGGLE_SETTINGS_SECTION);
            expect(res.state).to.be.ok;
        });
    });
});