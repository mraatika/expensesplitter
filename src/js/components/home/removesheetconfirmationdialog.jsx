'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';
import {ModalDialog} from '../common/modaldialog.jsx';

/**
 * @class RemoveSheetConfirmationDialog
 * @description Confirmation dialog for sheet remove action
 * @extends React.Component
 */
export class RemoveSheetConfirmationDialog extends React.Component {
    /**
     * @constructor
     * @param  {Object} props
     *     {Function} onRemoveConfirmed
     */
    constructor(props) {
        super(props);
    }

    open() {
        this.refs.modal.open();
    }

    close() {
        this.refs.modal.close();
    }

    /**
     * Callback for the confirm button
     */
    onConfirmRemoval() {
        if (typeof this.props.onRemoveConfirmed == 'function') {
            this.props.onRemoveConfirmed();
        }

        this.close();
    }

    render() {
        const buttons = [
            {
                label: t('home.remove_sheet'),
                click: this.onConfirmRemoval.bind(this),
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
                ref="modal"
                showModal={false}
                header={ t('home.remove_sheet_confirmation_title') }
                buttons={buttons}
                className="small">
                { t('home.remove_sheet_confirmation_msg') }
            </ModalDialog>
        );
    }
}