import React from 'react';
import {Link, browserHistory} from 'react-router';
import SheetStore from '../../stores/sheetstore.js';
import ActionCreators from '../../actions/dataactioncreators';
import Constants from '../../constants/appconstants';
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

        this.state = this._getDefaultState();

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

        newState.currentSheet = SheetStore.getSheet(this.props.params.sheetId) || {};

        this.setState(newState);

        if (eventType === Constants.ErrorEventTypes.LOAD_SHEET) {
            this.setState({ errors: { sheetNotFound: true } });
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

    /**
     * Add new sheet (clear current sheet from state). Callback for add sheet button.
     * @private
     * @return  {undefined}
     */
    _handleAddSheetClick() {
        if (this.props.params.sheetId) browserHistory.push('/');
    }

    render() {
        const {currentSheet} = this.state;

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

                <MessageContainer show={this.state.errors.sheetNotFound} type="danger">
                    { t('home.sheet_not_found') }
                </MessageContainer>

                <SheetForm ref={c => this._sheetForm = c } currentSheet={currentSheet} />

                <div className="row">
                    <div className="four columns">
                        <Link
                            to={'/'}
                            className="u-full-width button"
                            disabled={!currentSheet}>
                            <i className="fa fa-plus fa-fw fa-lg" />
                            { t('home.button.new') }
                        </Link>
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
                    currentSheet={currentSheet} />

            </section>
        );
    }

}
