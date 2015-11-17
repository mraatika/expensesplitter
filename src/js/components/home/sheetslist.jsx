'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';
import {Sheet} from './sheet.jsx';

export class SheetsList extends React.Component {

    render() {
        var sheets = this.props.sheets;
        var currentSheetId = (this.props.currentSheet || {}).id;

        return (
            <ul className="list-selectable">
                <li className="list-header row">
                    <div className="five columns">
                        {t('home.sheet_name')}:
                    </div>
                    <div className="five columns">
                        {t('lang.created_on')}:
                    </div>
                </li>
                {
                    sheets.length ? sheets.map(sheet =>
                            <Sheet
                                key={sheet.id}
                                sheet={sheet}
                                isCurrentSheet={currentSheetId && sheet.id === currentSheetId} />
                    ) : <li><i>{ t('loadsheetdialog.no_sheets') }</i></li>
                }
            </ul>
        );
    }
}