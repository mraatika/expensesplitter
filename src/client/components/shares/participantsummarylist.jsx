import React, {PropTypes} from 'react';
import {t} from 'common/dictionary/dictionary';
import {findAllExpensesOfParticipant} from 'client/service/expensesservice';
import ParticipantSummaryListItem from 'client/components/shares/participantsummarylistitem.jsx';

/**
 * @class ParticipantsShareSummary
 * @description Section for displaying shares of all of the participants
 * @extends ReactComponent
 */
class ParticipantSummaryList extends React.Component {

    /**
     * @constructor
     * @param       {Object} props
     * @return      {ParticipantSummaryList}
     */
    constructor(props) {
        super(props);
        this.state = { expandAll: false };
    }

    /**
     * Toggle all summary list item panels expanded/collapsed
     * @private
     * @param   {Event} e
     */
    _toggleAllListItems(e) {
        e.preventDefault();
        this.setState({ expandAll: !this.state.expandAll });
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {expenses, sharesAndBalances} = this.props;
        const {expandAll} = this.state;
        const expenseFinder = findAllExpensesOfParticipant(expenses);

        return (
            <div className="panel-group participant-summary-list">
                <div className="text-right">
                    <a href="#" onClick={this._toggleAllListItems.bind(this)}>
                        {expandAll ? t('common.open_all') : t('common.close_all') }
                        &nbsp;
                        <i className={`fa fa-caret-${expandAll ? 'up' : 'down'}`} />
                    </a>
                </div>
                {
                    sharesAndBalances.map(shareAndBalance => {
                        const {participantId} = shareAndBalance;
                        const participantsExpenses = expenseFinder(participantId);

                        return <ParticipantSummaryListItem
                            key={shareAndBalance.participantId}
                            participantName={shareAndBalance.participantName}
                            expenses={participantsExpenses}
                            participants={this.props.participants}
                            currencySymbol={this.props.currencySymbol}
                            isExpanded={expandAll} />;
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