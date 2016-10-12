import React from 'react';
import {browserHistory, Link} from 'react-router';
import {toArray} from 'lodash';
import {t} from '../../dictionary/dictionary';
import LoadSheetDialog from './loadsheetdialog.jsx';
import MessageContainer from '../common/messagecontainer.jsx';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';
import SheetForm from './sheetform.jsx';

/**
 * @class Homepage
 * @description The index page
 * @extends {React.Component}
 */
export default class HomePage extends React.Component {

    /**
     * @constructor
     * @return {HomePage}
     */
    constructor(props) {
        super(props);
        this.state = { newSheetCreated: false };
    }

    /**
     * Callback for load sheet button
     * @private
     * @param   {Event} e
     */
    _handleLoadSheetClick(e) {
        e.preventDefault();
        this.refs.loadSheetDialog.open();
    }

    /**
     * Callback for remove sheet button
     * @private
     */
    _handleRemoveSheetClick() {
        this.refs.removeSheetConfirmationDialog.open();
    }

    /**
     * Callback for sheet remove dialog's confirm
     * @private
     */
    _onSheetRemovalConfirmed() {
        const {sheet} = this.props;

        if (sheet) {
            this.refs.removeSheetConfirmationDialog.close();
            this.props.removeSheet(sheet);
            browserHistory.push('/');
        }
    }

    /**
     * Callback for new sheet button
     * @private
     */
    _onAddClick() {
        this.setState({ newSheetCreated: true});
        this.props.onAddClick();
    }

    render() {
        const {dirty, sheet} = this.props;

        return (
            <section id="home-page">
                <h5 className="text-center">{t('app.info') }</h5>

                <p id="app-description">
                    { t('app.description') }
                </p>

                <MessageContainer
                    show={this.state.newSheetCreated}
                    onClose={() => this.setState({ newSheetCreated: false })}
                    type="info">
                    { t('home.prev_sheet_saved') + ' ' }
                    <Link to={'/'} onClick={this._handleLoadSheetClick.bind(this)}>{ t('home.load_sheet_action') }</Link>.
                </MessageContainer>

                <SheetForm
                    ref={c => this._sheetForm = c }
                    sheet={sheet}
                    dirty={dirty}
                    saveSheet={this.props.saveSheet}
                    updateSheet={this.props.updateSheet}
                />

                <div className="row">
                    <div className="four columns">
                        <button
                            onClick={() => this._onAddClick()}
                            className="u-full-width button"
                            disabled={!sheet.lastSavedOn}>
                            <i className="fa fa-plus fa-fw fa-lg" />
                            { t('home.button.new') }
                        </button>
                    </div>

                    <div className="four columns">
                        <button
                            id="button-remove-sheet"
                            className="u-full-width"
                            disabled={!sheet.lastSavedOn}
                            onClick={this._handleRemoveSheetClick.bind(this)}>
                            <i className="fa fa-trash-o fa-fw fa-lg" />
                            { t('home.button.remove') }
                        </button>
                    </div>

                    <div className="four columns">
                        <button
                            id="button-load-sheet"
                            onClick={this._handleLoadSheetClick.bind(this)}
                            className="u-full-width">
                            <i className="fa fa-upload fa-fw fa-lg" />
                            { t('home.button.load') }
                        </button>
                    </div>
                </div>

                <RemovalConfirmationDialog
                    ref="removeSheetConfirmationDialog"
                    onRemoveConfirmed={this._onSheetRemovalConfirmed.bind(this)}
                    header={ t('home.remove_sheet_confirmation_title') }
                    contentText={ t('home.remove_sheet_confirmation_msg') }
                    okButtonLabel={ t('home.remove_sheet') }
                />

                <LoadSheetDialog
                    ref="loadSheetDialog"
                    sheet={sheet}
                    fetchSheet={this.props.fetchSheet}
                    clearSheetHistory={this.props.clearSheetHistory}
                    sheets={toArray(this.props.sheetHistory)}/>

            </section>
        );
    }
}
