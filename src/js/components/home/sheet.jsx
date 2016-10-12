import React from 'react';
import {browserHistory} from 'react-router';
import classNames from 'classnames';
import {DateUtils} from '../../util/utils.js';
import {t} from '../../dictionary/dictionary.js';

/**
 * @class Sheet
 * @description A component to represent a single sheet in the sheets list
 * @extends {React.Component}
 */
export default class Sheet extends React.Component {

    /**
     * Navigate to home page with selected sheet as current sheet
     * @private
     */
    _handleSheetItemClick() {
        browserHistory.push(`/sheet/${this.props.sheet.id}`);
    }

    render() {
        const {sheet, isCurrentSheet} = this.props;
        const iconClassName = classNames('fa', 'fa-check-circle-o', 'fa-lg', 'text-green', {
            'hidden': !isCurrentSheet
        });

        return (
            <li onClick={this._handleSheetItemClick.bind(this)}>
                <div className="row">
                    <div className="five columns">
                        <span className="sheet-list-name">{sheet.name}</span>&nbsp;
                        <i
                            className={iconClassName}
                            aria-hidden={!isCurrentSheet} />
                    </div>
                    <div className="seven columns">
                        <span className="sheet-list-date">{DateUtils.format(sheet.createdOn, t('app.locales.date_format'))}</span>
                    </div>
                </div>
            </li>
        );
    }
}
