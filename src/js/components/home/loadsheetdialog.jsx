import React from 'react';
import {t} from '../../dictionary/dictionary';
import SheetHistoryStore from '../../stores/sheethistorystore';
import SheetsList from './sheetslist.jsx';
import ModalDialog from '../common/modaldialog.jsx';
import ActionCreators from '../..//actions/dataactioncreators';

/**
 * @class LoadSheetDialog
 * @description Modal dialog for loading a saved sheet for editing
 * @extends {ReactComponent}
 */
export default class LoadSheetDialog extends React.Component {
    /**
     * @constructor
     * @return {HomePage}
     */
    constructor(props) {
        super(props);

        this.state = { sheets: SheetHistoryStore.getHistory() };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SheetHistoryStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetHistoryStore.removeChangeListener(this._onChange);
    }


    /**
     * Callback for SheetHistoryStore's change events
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState({ sheets: SheetHistoryStore.getHistory()});
    }

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

    _clearHistory() {
        ActionCreators.clearHistory();
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const buttons = [
            { label: t('loadsheetdialog.button.clear_history'), icon: 'fa-trash-o', click: this._clearHistory },
            { label: t('lang.close'), icon: 'fa-close' }
        ];

        return (
            <ModalDialog
                ref={c => this._dialog = c}
                onCloseRequest={this.props.onCloseRequest}
                header={t('loadsheetdialog.header')}
                buttons={buttons}>
                <section id="load-sheet-dialog">
                    <SheetsList
                        sheets={this.state.sheets}
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