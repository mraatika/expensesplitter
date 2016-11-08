import React, {PropTypes} from 'react';
import ExpensesService from 'client/service/expensesservice';
import ParticipantSummaryListItem from 'client/components/shares/participantsummarylistitem.jsx';

/**
 * @class ParticipantsShareSummary
 * @description Section for displaying shares of all of the participants
 * @extends ReactComponent
 */
class ParticipantSummaryList extends React.Component {
    /**
     * @return {ReactComponent}
     */
    render() {
        const expensesService = new ExpensesService({ expenses: this.props.expenses });

        return (
            <div className="panel-group participant-summary-list">
                {
                    this.props.sharesAndBalances.map(shareAndBalance => {
                        const expenses = expensesService.findAllExpensesOfParticipant(shareAndBalance.participantId);
                        return <ParticipantSummaryListItem
                            key={shareAndBalance.participantId}
                            participantName={shareAndBalance.participantName}
                            expenses={expenses}
                            participants={this.props.participants}
                            currencySymbol={this.props.currencySymbol}/>;
                    })
                }
            </div>
        );
    }
}

ParticipantSummaryList.defaultProps = {
    expenses: [],
    sharesAndBalances: [],
    participants: [],
    currencySymbol: ''
};

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
    participants: React.PropTypes.array,

    /**
     * Symbol to be appended to currency values
     * @type {string}
     */
    currencySymbol: PropTypes.string
};

export default ParticipantSummaryList;