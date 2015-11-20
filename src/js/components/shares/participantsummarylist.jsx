import React from 'react';
import _ from 'lodash';
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
        const findParticipantsShareAndBalance = participantId => {
            console.log(participantId, this.props.sharesAndBalances);
            return _.find(this.props.sharesAndBalances, balance => balance.participantId === participantId);
        };

        return (
            <div className="panel-group">
                {
                    this.props.participants.map(participant => {
                        const expenses = expensesService.findAllExpensesOfParticipant(participant.id);
                        const shareAndBalance = findParticipantsShareAndBalance(participant.id);
                        return <ParticipantSummaryListItem
                            key={participant.id}
                            expenses={expenses}
                            participant={participant}
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
