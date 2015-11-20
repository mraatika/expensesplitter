import React from 'react';
import {t} from '../../dictionary/dictionary';
import SheetsList from './sheetslist.jsx';
import {ModalDialog} from '../common/modaldialog.jsx';

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
        this.refs.dialog.open();
    }

    /**
     * Close the dialog
     * @return {undefined}
     */
    close() {
        this.refs.dialog.close();
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <ModalDialog
                ref="dialog"
                showModal={false}
                onCloseRequest={this.props.onCloseRequest}
                header={t('loadsheetdialog.header')}>
                <section id="load-sheet-dialog">
                    <SheetsList
                        sheets={this.props.sheets}
                        currentSheet={this.props.currentSheet} />
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