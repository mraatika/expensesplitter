'use strict';

import React from 'react';
import ExpensesService from '../../service/expensesservice';
import ParticipantSummaryListItem from './participantsummarylistitem.jsx';

/**
 * @class ParticipantsShareSummary
 * @description Section for displaying shares of all of the participants
 * @extends ReactComponent
 */
export default class ParticipantSummaryList extends React.Component {
    /**
     * @return {ReactComponent}
     */
    render() {
        const expensesService = new ExpensesService({ expenses: this.props.expenses });

        return (
            <div className="panel-group">
                {
                    this.props.sharesAndBalances.map(shareAndBalance => {
                        const expenses = expensesService.findAllExpensesOfParticipant(shareAndBalance.participantId);
                        return <ParticipantSummaryListItem
                            key={shareAndBalance.participantId}
                            expenses={expenses}
                            participants={this.props.participants}
                            sharesAndBalances={shareAndBalance} />;
                    })
                }
            </div>
        );
    }
}

ParticipantSummaryList.propTypes = {
    /**
     * List of all the expenses in the current sheet
     * @type {Array}
     */
    expenses: React.PropTypes.array,
    /**
     * List of shares/balance objects
     * @type {Array}
     */
    sharesAndBalances: React.PropTypes.array,
    /**
     * List of all the participants in the current sheet
     * @type {Array}
     */
    participants: React.PropTypes.array
};
