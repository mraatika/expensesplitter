import React, {PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {t} from '../../dictionary/dictionary.js';
import Settings from './settings.jsx';
import InputButtonSplit from '../common/inputbuttonsplit.jsx';

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
        browserHistory.push(`/sheet/${this.props.sheet.id}/participants`);
    }

    /**
     * Callback for current sheet name input's change
     * @private
     * @return {undefined}
     */
    _handleCurrentSheetNameChange() {
        this.props.updateSheet(this.props.sheet, { name: this.sheetNameInput.value });
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
        browserHistory.push(`/sheet/${this.props.sheet.id}/summary`);
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
                        { t( this.props.sheet ? 'lang.current_sheet' : 'home.name_your_sheet') }:
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
    summaryButtonDisabled: PropTypes.boolean
};

export default SheetForm;