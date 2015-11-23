import React from 'react';
import {t} from '../../dictionary/dictionary';
import SheetsList from './sheetslist.jsx';
import {ModalDialog} from '../common/modaldialog.jsx';
import ActionCreators from '../..//actions/dataactioncreators';
import RemovalConfirmationDialog from '../common/removalconfirmationdialog.jsx';

/**
 * @class LoadSheetDialog
 * @description Modal dialog for loading a saved sheet for editing
 * @extends {ReactComponent}
 */
export default class LoadSheetDialog extends React.Component {
    /**
     * Open the dialog
     * @return {undefined}
     */
    open() {
        this._dialog.open();
    }

    /**
     * Close the dialog
     * @return {undefined}
     */
    close() {
        this._dialog.close();
    }

    _handleRemoveClick(sheet) {
        this._removeConfirmationDialog.open().then(() => {
            this._removeSheet(sheet);
        });
    }

    _removeSheet(sheet) {
        ActionCreators.removeSheet(sheet.id);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <ModalDialog
                ref={c => this._dialog = c}
                onCloseRequest={this.props.onCloseRequest}
                header={t('loadsheetdialog.header')}>
                <section id="load-sheet-dialog">
                    <SheetsList
                        onRemoveClick={this._handleRemoveClick.bind(this)}
                        sheets={this.props.sheets}
                        currentSheet={this.props.currentSheet} />
                </section>
                <RemovalConfirmationDialog
                    ref={c => this._removeConfirmationDialog = c}
                    header={ t('home.remove_sheet_confirmation_title') }
                    contentText={ t('home.remove_sheet_confirmation_msg') }
                    okButtonLabel={ t('home.remove_sheet') }
                />
            </ModalDialog>
        );
    }
}

LoadSheetDialog.propTypes = {
    /**
     * An array of sheet objects
     * @type {array}
     */
    sheets: React.PropTypes.array,
    /**
     * Currently loaded sheet
     * @type {object}
     */
    currentSheet: React.PropTypes.object,
    /**
     * Callback for the modal's close
     * @type {function}
     */
    onCloseRequest: React.PropTypes.func
};