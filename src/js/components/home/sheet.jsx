'use strict';

import React from 'react';
import ActionCreators from '../..//actions/dataactioncreators';
import {t} from '../../dictionary/dictionary';

export default class Sheet extends React.Component {

    handleRemoveClick(e) {
        e.stopPropagation();
        ActionCreators.removeSheet(this.props.sheet.id);
    }

    handleSheetItemClick() {
        ActionCreators.setActiveSheet(this.props.sheet.id);
    }

    render() {
        var sheet = this.props.sheet;

        return (
            <li onClick={this.handleSheetItemClick.bind(this)}>
                <div className="row">
                    <div className="five columns">
                        <span className="sheet-list-name">{sheet.name}</span>
                        &nbsp;
                        <i
                            className={'fa fa-check-circle-o fa-lg text-green' + (this.props.isCurrentSheet ? '' : ' hidden')}
                            aria-hidden={!this.isCurrentSheet} />
                    </div>
                    <div className="five columns">
                        <span className="sheet-list-date">{sheet.createdOn.toLocaleString()}</span>
                    </div>
                    <div className="two columns text-center">
                        <i
                            className="fa fa-trash-o fa-fw fa-lg icon-button"
                            aria-role="button"
                            title={t('home.remove_sheet')}
                            onClick={this.handleRemoveClick.bind(this)} />
                    </div>
                </div>
            </li>
        );
    }

}
