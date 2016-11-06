import React, {PropTypes} from 'react';
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
        this.props.onRemoveConfirmed();
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