import React from 'react';
import SheetStore from '../../stores/sheetstore.js';
import ActionCreators from '../../actions/dataactioncreators';
import Constants from '../../constants/AppConstants';
import {t} from '../../dictionary/dictionary';
import Router from '../../router/router.js';
import pages from '../../constants/pages.js';
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

        this.state = {
            newSheetCreated: false,
            errors: {}
        };

        this._onChange = this._onChange.bind(this);
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
        return {
            errors: {},
            newSheetCreated: false
        };
    }

    /**
     * Callback for SheetStore's change events
     * @private
     * @param  {EventType} eventType
     * @return {undefined}
     */
    _onChange(eventType) {
        const newState = this._getDefaultState();

        this.setState(newState);

        if (eventType == Constants.EventTypes.REMOVE_SHEET_EVENT) {
            Router.navigateTo(pages.HOME.href);
        } else if (eventType === Constants.ErrorEventTypes.LOAD_SHEET) {
            this.setState({ errors: { sheetNotFound: true } });
        } else if (this.props.currentSheetId !== (newState.currentSheet || {}).id) {
            Router.navigateToSheetURL(pages.HOME.href);
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
        const currentSheet = SheetStore.getSheet(this.props.currentSheetId);

        if (this.props.currentSheetId) {
            this.refs.removeSheetConfirmationDialog.close();
            ActionCreators.removeSheet(currentSheet);
        }
    }

    _handleAddSheetClick() {
        if (this.props.currentSheetId) {
            Router.navigateTo(pages.HOME.href);
        }
    }

    render() {
        const currentSheet = SheetStore.getSheet(this.props.currentSheetId);
        const allSheets = SheetStore.getSheets();

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
                    <a href="/" onClick={this._handleLoadSheetClick.bind(this)}>{ t('home.load_sheet_action') }</a>.
                </MessageContainer>

                <MessageContainer show={this.state.errors.sheetNotFound} type="danger">
                    { t('home.sheet_not_found') }
                </MessageContainer>

                <SheetForm ref={c => this._sheetForm = c } currentSheet={currentSheet} />

                <div className="row">
                    <div className="four columns">
                        <button
                            id="button-add-sheet"
                            className="u-full-width"
                            disabled={!currentSheet}
                            onClick={this._handleAddSheetClick.bind(this)}>
                            <i className="fa fa-plus fa-fw fa-lg" />
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
                    sheets={allSheets}
                    currentSheet={currentSheet} />

            </section>
        );
    }

}
