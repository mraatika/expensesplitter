import React, {PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {t} from 'common/dictionary/dictionary.js';
import pages from 'client/constants/pages';
import RouterService from 'client/router/routerservice';
import Settings from 'client/components/home/settings.jsx';
import InputButtonSplit from 'client/components/common/inputbuttonsplit.jsx';

/**
 * @class SheetForm
 * @description Form component for creating new sheets
 * @extends {ReactComponent}
 */
class SheetForm extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     * @return {SheetForm}
     */
    constructor(props) {
        super(props);
        this.state = this._getDefaultState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.state = this._getDefaultState(nextProps);
    }

    /**
     * Form default (initial) state
     * @private
     * @param  {object} props
     * @return {object}
     */
    _getDefaultState(props) {
        return { isSettingsActive: props.dirty };
    }

    /**
     * Callback for form submit
     * @private
     * @param  {Event} e
     * @return {undefined}
     */
    _handleFormSubmit(e) {
        e.preventDefault();

        this.props.saveSheet(this.props.sheet);

        const {sheet} = this.props;
        let targetHref;
        let adminKey;

        // if the sheet is already saved then move to participants page
        if (sheet.lastSavedOn) {
            targetHref = pages.PARTICIPANTS.href;
            adminKey = this.props.adminKey;
        // if the sheet was just created then stay on the home page
        // just update url to admin url
        } else {
            targetHref = pages.HOME.href;
            adminKey = sheet.adminKey;

            this.props.toggleNewSheetAdded(true);
        }

        RouterService.navigateTo(targetHref, sheet.id, adminKey);
    }

    /**
     * Callback for current sheet name input's change
     * @private
     * @return {undefined}
     */
    _handleCurrentSheetNameChange(e) {
        this.props.updateSheet(this.props.sheet, { name: e.target.value });
    }

    /**
     * Show/hide the settings section. Callback for settings button's click.
     * @private
     * @return {undefined}
     */
    _handleSettingsClick() {
        this.setState({ isSettingsActive: !this.state.isSettingsActive });
    }

    /**
     * Callback for summary button. Save sheet and navigate to summary page.
     * @private
     */
    _onSummaryButtonClick() {
        this.props.saveSheet(this.props.sheet);
        RouterService.navigateTo(pages.SUMMARY.href, this.props.sheet.id, this.props.adminKey);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {sheet} = this.props;

        return (
            <form onSubmit={this._handleFormSubmit.bind(this)}>
                <div className="row">
                    <div className="two columns">
                        <label htmlFor="sheet-name">
                            { t( sheet.name ? 'lang.current_sheet' : 'home.name_your_sheet') }:
                        </label>
                    </div>

                    <div className="ten columns">
                        <InputButtonSplit>
                            <input
                                id="sheet-name"
                                required
                                autoFocus={true}
                                ref={c => this.sheetNameInput = c}
                                type="text"
                                placeholder={ t('home.sheet_name_placeholder') + '...' }
                                value={this.props.sheet.name || ''}
                                disabled={sheet.lastSavedOn}
                                onChange={this._handleCurrentSheetNameChange.bind(this)} />
                            <button
                                className={'settings-button' + (this.state.isSettingsActive ? ' active' : '')}
                                type="button"
                                aria-label={ t('settings.toggle_settings') }
                                onClick={this._handleSettingsClick.bind(this)}>
                                <i className="fa fa-gear fa-fw fa-2x"/>
                            </button>
                        </InputButtonSplit>
                    </div>
                </div>

                <Settings
                    ref={c => this._settings = c}
                    sheet={sheet}
                    show={this.state.isSettingsActive}
                    updateSheet={this.props.updateSheet}
                />

                <button
                    type="submit"
                    className="button-primary u-full-width"
                    required={true}>
                    <i
                        style={sheet.lastSavedOn ? { display: 'none' } : {}}
                        className="fa fa-file-o fa-fw" />
                    &nbsp;
                    { t(sheet.lastSavedOn ? 'home.button.edit' : 'home.button.add') }
                    &nbsp;
                    <i
                        style={!sheet.lastSavedOn ? { display: 'none' } : {}}
                        className="fa fa-angle-double-right" />
                </button>

                <button
                    type="button"
                    id="sheet-summary-link"
                    className="u-full-width"
                    disabled={this.props.summaryButtonDisabled}
                    onClick={this._onSummaryButtonClick.bind(this)}>
                    { t('lang.summary') }
                    <i className="fa fa-angle-double-right" />
                </button>
            </form>
        );
    }
}

SheetForm.propTypes = {
    sheet: PropTypes.object.isRequired,
    saveSheet: PropTypes.func.isRequired,
    updateSheet: PropTypes.func.isRequired,
    toggleNewSheetAdded: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    summaryButtonDisabled: PropTypes.bool
};

export default SheetForm;