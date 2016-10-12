import React from 'react';
import {t} from '../../dictionary/dictionary';
import SheetsList from './sheetslist.jsx';
import ModalDialog from '../common/modaldialog.jsx';

/**
 * @class LoadSheetDialog
 * @description Modal dialog for loading a saved sheet for editing
 * @extends {ReactComponent}
 */
class LoadSheetDialog extends React.Component {


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

    /**
     * @return {ReactComponent}
     */
    render() {
        const buttons = [
            {
                label: t('loadsheetdialog.button.clear_history'),
                icon: 'fa-trash-o',
                click: this.props.clearSheetHistory
            },
            {
                label: t('lang.close'),
                icon: 'fa-close'
            }
        ];

        return (
            <ModalDialog
                ref={c => this._dialog = c}
                onCloseRequest={this.props.onCloseRequest}
                header={t('loadsheetdialog.header')}
                buttons={buttons}>
                <section id="load-sheet-dialog">
                    <SheetsList
                        sheets={this.props.sheets}
                        sheet={this.props.sheet} />
                </section>
            </ModalDialog>
        );
    }
}

LoadSheetDialog.propTypes = {
    /**
     * An array of sheet objects
     * @type {array}
     */
    sheets: React.PropTypes.array.isRequired,
    /**
     * Currently loaded sheet
     * @type {object}
     */
    sheet: React.PropTypes.object.isRequired,
    /**
     * Callback for the modal's close
     * @type {function}
     */
    onCloseRequest: React.PropTypes.func
};

export default LoadSheetDialog;