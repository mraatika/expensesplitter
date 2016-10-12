import React from 'react';
import {t} from '../../dictionary/dictionary';
import Sheet from './sheet.jsx';

/**
 * @class SheetsList
 * @description A list of Sheet components
 * @extends {ReactComponent}
 */
export default class SheetsList extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {sheets} = this.props;

        return (
            <ul className="list-selectable">
                <li className="list-header row no-mobile">
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
                            isCurrentSheet={sheet.id === this.props.sheet.id} />
                    ) : <li><i>{ t('loadsheetdialog.no_sheets') }</i></li>
                }
            </ul>
        );
    }
}