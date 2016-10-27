import React, {PropTypes} from 'react';
import {browserHistory, Link} from 'react-router';
import {t} from '../../dictionary/dictionary';
import LoadSheetDialogContainer from 'containers/loadsheetdialogcontainer';
import MessageContainer from '../common/messagecontainer.jsx';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';
import SheetForm from './sheetform.jsx';

/**
 * @class Homepage
 * @description The index page
 * @extends {React.Component}
 */
class HomePage extends React.Component {

    /**
     * Callback for load sheet button
     * @private
     * @param   {Event} e
     */
    _handleLoadSheetClick(e) {
        e.preventDefault();
        this.props.toggleLoadSheetDialog(true);
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
        this.props.toggleNewSheetAdded(true);
        browserHistory.push('/');
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
                    show={this.props.newSheetAdded}
                    type="info">
                    { t('home.prev_sheet_saved') + ' ' }
                    <Link to={'/'} onClick={this._handleLoadSheetClick.bind(this)}>{ t('home.load_sheet_action') }</Link>.
                </MessageContainer>

                <SheetForm
                    ref={c => this._sheetForm = c }
                    sheet={sheet}
                    dirty={dirty}
                    summaryButtonDisabled={!this.props.params.sheetId}
                    saveSheet={this.props.saveSheet}
                    updateSheet={this.props.updateSheet}
                />

                <div className="row">
                    <div className="four columns">
                        <button
                            onClick={this._onAddClick.bind(this)}
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
                    header={ t('sheet_remove.confirmation_title') }
                    contentText={ t('sheet_remove.confirmation_msg') }
                    okButtonLabel={ t('sheet_remove.button') }
                />

                <LoadSheetDialogContainer />

            </section>
        );
    }
}

HomePage.propTypes = {
    sheet: PropTypes.object.isRequired,
    saveSheet: PropTypes.func.isRequired,
    updateSheet: PropTypes.func.isRequired,
    removeSheet: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    dirty: PropTypes.bool,
    newSheetAdded: PropTypes.bool
};

export default HomePage;