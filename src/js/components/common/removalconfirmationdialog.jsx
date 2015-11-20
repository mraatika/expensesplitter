import React from 'react';
import _ from 'lodash';
import {t} from '../../dictionary/dictionary';
import {ModalDialog} from '../common/modaldialog.jsx';

/**
 * @class RemovalConfirmationDialog
 * @description Confirmation dialog for model removal
 * @extends {React.Component}
 */
export default class RemovalConfirmationDialog extends React.Component {

    /**
     * Open the modal
     * @return {undefined}
     */
    open() {
        this._modal.open();
    }

    /**
     * Close the modal
     * @return {undefined}
     */
    close() {
        this._modal.close();
    }

    /**
     * Callback for the confirm button
     * @private
     * @return {undefined} [description]
     */
    _onConfirmRemoval() {
        if (_.isFunction(this.props.onRemoveConfirmed)) {
            this.props.onRemoveConfirmed();
        }

        this.close();
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const buttons = [
            {
                label: this.props.okButtonLabel,
                click: this._onConfirmRemoval.bind(this),
                icon: 'fa-trash-o',
                buttonStyle: 'danger'
            },
            {
                label: t('lang.cancel'),
                icon: 'fa-times'
            }
        ];

        return (
            <ModalDialog
                ref={c => this._modal = c}
                showModal={false}
                header={ this.props.header }
                buttons={buttons}
                className="small">
                { this.props.contentText }
            </ModalDialog>
        );
    }
}