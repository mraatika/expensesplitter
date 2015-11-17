'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';
import {SheetsList} from './sheetslist.jsx';
import {ModalDialog} from '../common/modaldialog.jsx';

export class LoadSheetDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    open() {
        this.refs.dialog.open();
    }

    close() {
        this.refs.dialog.close();
    }

    render() {
        return (
            <ModalDialog
                ref="dialog"
                showModal={false}
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