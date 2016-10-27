import React, {PropTypes} from 'react';
import {browserHistory} from 'react-router';
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
     * Callback for sheet list's entry's click event
     * @private
     * @param   {Object} sheet
     */
    _onSheetItemClick(sheet) {
        this.close();
        browserHistory.push(`/sheet/${sheet.id}`);
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
                header={t('loadsheetdialog.header')}
                buttons={buttons}>
                <section id="load-sheet-dialog">
                    <SheetsList
                        onSheetItemClick={this._onSheetItemClick.bind(this)}
                        sheets={this.props.sheetHistory}
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
    sheetHistory: PropTypes.array.isRequired,
    /**
     * Currently loaded sheet
     * @type {object}
     */
    sheet: PropTypes.object.isRequired,

    clearSheetHistory: PropTypes.func.isRequired
};

export default LoadSheetDialog;