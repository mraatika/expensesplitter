import React from 'react';
import classNames from 'classnames';
import ActionCreators from '../../actions/dataactioncreators';
import TrashButton from '../common/trashbutton.jsx';
import {DateUtils} from '../../util/utils.js';
import {t} from '../../dictionary/dictionary.js';

export default class Sheet extends React.Component {

    _handleSheetItemClick() {
        ActionCreators.setActiveSheet(this.props.sheet.id);
    }

    _handleRemoveClick(e) {
        e.stopPropagation();
        this.props.onRemoveClick(this.props.sheet);
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
                        <TrashButton className="u-pull-right" onClick={this._handleRemoveClick.bind(this)}/>
                    </div>
                </div>
            </li>
        );
    }
}
