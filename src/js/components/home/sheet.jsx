import React from 'react';
import classNames from 'classnames';
import ActionCreators from '../../actions/dataactioncreators';
import {TrashButton} from '../common/trashbutton.jsx';

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
                    <div className="five columns">
                        <span className="sheet-list-date">{sheet.createdOn.toLocaleString()}</span>
                    </div>
                    <div className="two columns text-center">
                        <TrashButton onClick={this._handleRemoveClick.bind(this)}/>
                    </div>
                </div>
            </li>
        );
    }
}
