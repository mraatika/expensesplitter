import React from 'react';
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
        const text = `${t('settings.settings_for_sheet')} ${this.props.sheet.name}`;

        return <CollapsiblePanelHeader
            headerText={text}/>;
    }

    /**
     * Return settings section for render
     * @private
     * @return {ReactComponent}
     */
    _getSettingsSection() {
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
                    value={this.props.sheet.settings.currencySymbol}
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
                expanded={this.props.show}
                style={{'display': this.props.show ? 'block' : 'none'}}
                header={this._getHeader()}>
                {this._getSettingsSection()}
            </Panel>
        );
    }
}