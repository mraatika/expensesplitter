'use strict';

import React from 'react';
import ExpenseList from '../expenses/expenselist.jsx';
import {Number as NumberUtils} from '../../util/utils';

/**
 * @class ParticipantsShareSummary
 * @description Summary of all the expenses and shares of a participant
 * @extends React.Component
 */
class ParticipantsShareSummary extends React.Component {

    render() {
        var share = this.props.share;

        return (
            <div className="participants-share-list">
                <div className="particpants-share-list-header">
                    <h3>{ share.participantName}</h3>
                    <span>{NumberUtils.round(share.amount, 1)}</span>
                </div>

                <div className="participants-share-list-content">
                    <ExpenseList {...this.props} isRemoveAllowed={false} hideFooter={true} />
                </div>
            </div>
        );
    }
}

export default ParticipantsShareSummary;
