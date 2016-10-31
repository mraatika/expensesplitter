import React, {PropTypes} from 'react';
import {isFunction}  from 'lodash';
import Q from 'kew';
import {t} from 'common/dictionary/dictionary';
import ModalDialog from '../common/modaldialog.jsx';

/**
 * @class RemovalConfirmationDialog
 * @description Confirmation dialog for model removal
 * @extends {React.Component}
 */
class RemovalConfirmationDialog extends React.Component {

    /**
     * Open the modal
     * @return {Q} A Q promise object
     */
    open() {
        this._promise = Q.defer();
        this._modal.open();
        return this._promise;
    }

    /**
     * Close the modal
     * @return {undefined}
     */
    close() {
        // reject the promise object
        this._promise.reject();
        this._modal.close();
    }

    /**
     * Callback for the confirm button
     * @private
     * @return {undefined} [description]
     */
    _onConfirmRemoval() {
        if (isFunction(this.props.onRemoveConfirmed)) {
            this.props.onRemoveConfirmed();
        }
        // resolve the promise object
        this._promise.resolve();
        // dont't use this.close for it will reject the promise
        this._modal.close();
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
                header={ this.props.header }
                buttons={buttons}
                className="small">
                { this.props.contentText }
            </ModalDialog>
        );
    }
}

RemovalConfirmationDialog.defaultProps = {
    contentText: '',
    header: t('common.confirm_removal'),
    okButtonLabel: t('lang.remove'),
    onRemoveConfirmed: () => {}
};

RemovalConfirmationDialog.propTypes = {
    contentText: PropTypes.string,
    header: PropTypes.string,
    okButtonLabel: PropTypes.string,
    onRemoveConfirmed: PropTypes.func
};

export default RemovalConfirmationDialog;