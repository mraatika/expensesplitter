import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import {t} from '../../dictionary/dictionary.js';
import CollapsiblePanelHeader from '../common/collapsiblepanelheader.jsx';
import ActionCreators from '../../actions/dataactioncreators';
import SaveButton from '../common/savebutton.jsx';

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
        this.setState({ show: _.isUndefined(state) ? !this.state.show : state });
    }

    /**
     * @private
     * @param  {object} props
     * @return {undefined}
     */
    componentWillReceiveProps(props) {
        if (props.sheet != this.props.sheet) {
            this.setState(this._getDefaultState(props));
        }
    }

    /**
     * Returns default state
     * @private
     * @param  {object} props
     * @return {object}
     */
    _getDefaultState(props) {
        const settings = props.sheet.settings;

        return {
            isSaved: false,
            newSettings: _.clone(settings),
            show: (this.state || {}).show || false
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
        const {newSettings} = this.state;
        newSettings[name] = value;
        this.setState({
            isSaved: false,
            newSettings: newSettings
        });
    }

    /**
     * Callback for save button's click event
     * @private
     * @return {undefined}
     */
    _onSaveClick() {
        const {newSettings} =  this.state;
        ActionCreators.setSettings(newSettings);
        this.setState({ isSaved: true });
    }

    /**
     * Return header for the panel
     * @private
     * @return {ReactComponent}
     */
    _getHeader() {
        return <CollapsiblePanelHeader
            onExpand={() => this.toggle()}
            headerText={ t('lang.settings') }
            isExpanded={this.state.show} />;
    }

    /**
     * Return settings section for render
     * @private
     * @return {ReactComponent}
     */
    _getSettingsSection() {
        const {newSettings, isSaved} = this.state;

        return <section>
            <label htmlFor="settings-currency">
                { t('settings.currency_symbol') }
            </label>
            <input
                type="text"
                maxLength="3"
                minLength="1"
                size="3"
                value={newSettings.currencySymbol}
                onChange={(e) => this._onSettingChange('currencySymbol', e.target.value )}
                id="settings-currency"/>
            <SaveButton
                type="button"
                className="u-full-width"
                isSaved={isSaved}
                beforeSaveText={t('settings.save')}
                afterSaveText={t('lang.saved')}
                onClick={this._onSaveClick.bind(this)} />
        </section>;
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <Panel
                collapsible
                expanded={this.state.show}
                style={{'display': this.state.show ? 'block' : 'none'}}
                header={this._getHeader()}>
                {this._getSettingsSection()}
            </Panel>
        );
    }
}