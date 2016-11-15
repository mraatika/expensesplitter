import React, {PropTypes} from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import {extend} from 'lodash';
import {t} from 'common/dictionary/dictionary';
import CollapsiblePanelHeader from 'client/components/common/collapsiblepanelheader.jsx';

/**
 * @class Settings
 * @description Sheet's settings section
 * @extends {ReactComponent}
 */
class Settings extends React.Component {
    /**
     * Callback for setting value change
     * @private
     * @param  {string} name  Name of the setting changed
     * @param  {string} value Value of the setting changed
     * @return {undefined}
     */
    _onSettingChange(name, value) {
        const {sheet} = this.props;
        const newSettings = extend({}, sheet.settings, {
            [name]: value
        });

        this.props.updateSheet(sheet, { settings: newSettings });
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

Settings.propTypes = {
    sheet: PropTypes.object.isRequired,
    updateSheet: PropTypes.func.isRequired,
    show: PropTypes.bool
};

export default Settings;