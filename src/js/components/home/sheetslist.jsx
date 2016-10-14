import React, {PropTypes} from 'react';
import {t} from 'dictionary/dictionary';
import Sheet from 'components/home/sheet.jsx';

/**
 * @class SheetsList
 * @description A list of Sheet components
 * @extends {ReactComponent}
 */
class SheetsList extends React.Component {

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
                            onSheetItemClick={this.props.onSheetItemClick}
                            isCurrentSheet={sheet.id === this.props.sheet.id} />
                    ) : <li><i>{ t('loadsheetdialog.no_sheets') }</i></li>
                }
            </ul>
        );
    }
}

SheetsList.defaultProps = {
    sheets: [],
    onSheetItemClick: () => {}
};

SheetsList.propTypes = {
    sheet: PropTypes.object.isRequired,
    sheets: PropTypes.array,
    onSheetItemClick: PropTypes.func
};

export default SheetsList;