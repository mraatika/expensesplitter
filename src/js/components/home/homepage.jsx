import React from 'react';
import SheetStore from '../../stores/sheetstore.js';
import ActionCreators from '../../actions/dataactioncreators';
import Constants from '../../constants/AppConstants';
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
    constructor() {
        super();
        this.state = this._getDefaultState();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        const {currentSheetPromise} = this.props;

        if (currentSheetPromise) {
            currentSheetPromise
                .then((sheet) => {
                    this.setState({ currentSheet: sheet });
                });
        }
    }

    componentDidMount() {
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetStore.removeChangeListener(this._onChange);
    }

    /**
     * Returns the initial state
     * @private
     * @return {object}
     */
    _getDefaultState() {
        const currentSheet = SheetStore.getCurrentSheet();
        const allSheets = SheetStore.getSheets();

        return {
            currentSheet: currentSheet,
            sheets: allSheets
        };
    }

    /**
     * Callback for SheetStore's change events
     * @private
     * @param  {EventType} eventType
     * @return {undefined}
     */
    _onChange(eventType) {
        this.refs.infoMessageContainer.close();

        this.setState(this._getDefaultState());

        if (eventType === Constants.EventTypes.SET_ACTIVE_SHEET_EVENT) {
            this.refs.loadSheetDialog.close();
        }
    }

    _handleLoadSheetClick(e) {
        e.preventDefault();
        this.refs.loadSheetDialog.open();
    }

    _handleRemoveSheetClick() {
        this.refs.removeSheetConfirmationDialog.open();
    }

    _onSheetRemovalConfirmed() {
        if (this.state.currentSheet) {
            this.refs.removeSheetConfirmationDialog.close();
            ActionCreators.removeSheet(this.state.currentSheet);
        }
    }

    _handleAddSheetClick() {
        if (this.state.currentSheet) {
            this.setState({ currentSheet: null }, () => {
                this.refs.infoMessageContainer.open();
                this._sheetForm.sheetNameInput.focus();
            });
        }
    }

    render() {
        const {currentSheet} = this.state;

        return (
            <section id="home-page">
                <h5 className="text-center">{t('app.info') }</h5>

                <p id="app-description">
                    { t('app.description') }
                </p>

                <MessageContainer ref="infoMessageContainer" type="info">
                    { t('home.prev_sheet_saved') + ' ' }
                    <a href="/" onClick={this._handleLoadSheetClick.bind(this)}>{ t('home.load_sheet_action') }</a>.
                </MessageContainer>

                <SheetForm ref={c => this._sheetForm = c } currentSheet={currentSheet} />

                <div className="row">
                    <div className="four columns">
                        <button
                            id="button-add-sheet"
                            className="u-full-width"
                            disabled={!currentSheet}
                            onClick={this._handleAddSheetClick.bind(this)}>
                            <i className="fa fa-file-o fa-fw fa-lg" />
                            { t('home.button.new') }
                        </button>
                    </div>

                    <div className="four columns">
                        <button
                            id="button-remove-sheet"
                            className="u-full-width"
                            disabled={!currentSheet}
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
                    sheets={this.state.sheets}
                    currentSheet={currentSheet} />

            </section>
        );
    }

}
