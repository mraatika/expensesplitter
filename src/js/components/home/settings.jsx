import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import {t} from '../../dictionary/dictionary.js';
import CollapsiblePanelHeader from '../common/collapsiblepanelheader.jsx';

/**
 * @class Settings
 * @description Sheet's settings section
 * @extends {ReactComponent}
 */
export default class Settings extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     * @return {Settings}
     */
    constructor(props) {
        super(props);
        this.state = this._getDefaultState(this.props);
    }

    /**
     * Show/hide the element
     * @return {undefined}
     */
    toggle(state) {
        this.setState({ isOpen: _.isUndefined(state) ? !this.state.isOpen : state });
    }

    /**
     * @private
     * @param  {object} props
     * @return {undefined}
     */
    componentWillReceiveProps(props) {
        this.setState(this._getDefaultState(props));
    }

    /**
     * Returns default state
     * @private
     * @param  {object} props
     * @return {object}
     */
    _getDefaultState(props) {
        const settings = (props.sheet || {}).settings;

        return {
            isOpen: props.show,
            settings: settings ? _.clone(settings) : {
                currencySymbol: t('app.locales.currency_symbol')
            }
        };
    }

    /**
     * Callback for setting value change
     * @private
     * @param  {string} name  Name of the setting changed
     * @param  {string} value Value of the setting changed
     * @return {undefined}
     */
    _onSettingChange(name, value) {
        const newSettings = Object.assign({}, this.props.sheet.settings, {
            [name]: value
        });

        this.props.updateSheet(this.props.sheet, {
            settings: newSettings
        });
    }

    /**
     * Return header for the panel
     * @private
     * @return {ReactComponent}
     */
    _getHeader() {
        const text = this.props.sheet ?
            `${t('settings.settings_for_sheet')} ${this.props.sheet.name}` :
            t('lang.settings');

        return <CollapsiblePanelHeader
            headerText={text}/>;
    }

    /**
     * Return settings section for render
     * @private
     * @return {ReactComponent}
     */
    _getSettingsSection() {
        const {settings} = this.state;

        return (
            <section id="sheet-settings">
                <label htmlFor="settings-currency">
                    { t('settings.currency_symbol') }:
                </label>

                <input
                    type="text"
                    maxLength="3"
                    minLength="1"
                    size="3"
                    value={settings.currencySymbol}
                    onChange={(e) => this._onSettingChange('currencySymbol', e.target.value )}
                    id="settings-currency"/>
            </section>
        );
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <Panel
                collapsible
                expanded={this.state.isOpen}
                style={{'display': this.state.isOpen ? 'block' : 'none'}}
                header={this._getHeader()}>
                {this._getSettingsSection()}
            </Panel>
        );
    }
}