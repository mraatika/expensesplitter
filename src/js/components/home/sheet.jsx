import React from 'react';
import classNames from 'classnames';
import Router from '../../router/router.js';
import ActionCreators from '../../actions/dataactioncreators.js';
import pages from '../../constants/pages.js';
import {DateUtils} from '../../util/utils.js';
import {t} from '../../dictionary/dictionary.js';

export default class Sheet extends React.Component {

    _handleSheetItemClick() {
        Router.navigateToSheetURL(pages.HOME.href, this.props.sheet.id);
        ActionCreators.loadSheet(this.props.sheet.id);
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
