import React from 'react';
import page from 'page';
import {t} from '../../dictionary/dictionary.js';
import ActionCreators from '../../actions/dataactioncreators';
import pages from '../../constants/pages';
import Settings from './settings.jsx';
import InputButtonSplit from '../common/inputbuttonsplit.jsx';

/**
 * @class SheetForm
 * @description Form component for creating new sheets
 * @extends {ReactComponent}
 */
export default class SheetForm extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     * @return {SheetForm}
     */
    constructor(props) {
        super(props);
        this.state = this._getDefaultState(props);
    }

    /**
     * @param  {object} newProps
     * @return {undefined}
     */
    componentWillReceiveProps(newProps) {
        if (newProps.currentSheet != this.props.currentSheet) {
            this.state = this._getDefaultState(newProps);
        }
    }

    /**
     * Form default (initial) state
     * @private
     * @param  {object} props
     * @return {object}
     */
    _getDefaultState(props) {
        const currentSheet = props.currentSheet;

        return {
            currentSheetName: (currentSheet || {}).name,
            isSettingsActive: false
        };
    }

    /**
     * Move to participants page if currentSheet is present
     * @private
     * @return {undefined}
     */
    _continueWithCurrentSheet() {
        // move to participants section
        if (this.props.currentSheet) page(pages.PARTICIPANTS.href);
    }

    /**
     * Create new sheet with name from sheet name input
     * @private
     * @return {undefined}
     */
    _addSheet() {
        var sheetName = this.state.currentSheetName;
        if (sheetName) ActionCreators.addSheet(sheetName);
    }

    /**
     * Callback for form submit
     * @private
     * @param  {Event} e
     * @return {undefined}
     */
    _handleFormSubmit(e) {
        e.preventDefault();

        if (this.props.currentSheet) {
            this._continueWithCurrentSheet();
        } else {
            this._addSheet();
        }
    }

    /**
     * Callback for current sheet name input's change
     * @private
     * @return {undefined}
     */
    _handleCurrentSheetNameChange() {
        this.setState({ currentSheetName: this.sheetNameInput.value });
    }

    /**
     * Show/hide the settings section. Callback for settings button's click.
     * @private
     * @return {undefined}
     */
    _handleSettingsClick() {
        this._settings.toggle();
        this.setState({ isSettingsActive: !this.state.isSettingsActive });
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {currentSheet} = this.props;

        return (
            <form onSubmit={this._handleFormSubmit.bind(this)}>
                <div className="row">
                    <div className="two columns">
                        <label htmlFor="sheet-name">
                        { t( this.props.currentSheet ? 'lang.current_sheet' : 'home.name_your_sheet') }:
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
                                value={this.state.currentSheetName}
                                disabled={currentSheet}
                                onChange={this._handleCurrentSheetNameChange.bind(this)} />
                            <button
                                className={'settings-button' + (this.state.isSettingsActive ? ' active' : '')}
                                type="button"
                                disabled={!currentSheet}
                                aria-label={ t('settings.toggle_settings') }
                                onClick={this._handleSettingsClick.bind(this)}>
                                <i className="fa fa-gear fa-fw fa-2x"/>
                            </button>
                        </InputButtonSplit>
                    </div>
                </div>
                {
                    (() => {
                        if (currentSheet) {
                            return <Settings
                                ref={c => this._settings = c}
                                sheet={currentSheet}/>;
                        }
                    })()
                }
                <button
                    type="submit"
                    className="button-primary u-full-width"
                    required={true}>
                    { t(currentSheet ? 'home.button.edit' : 'home.button.add') }
                    &nbsp;
                    <i
                        style={!currentSheet ? { display: 'none' } : {}}
                        className="fa fa-angle-double-right" />
                </button>
            </form>
        );
    }
}