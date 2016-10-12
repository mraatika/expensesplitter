import _ from 'lodash';
import React from 'react';
import TrashButton from 'components/common/trashbutton.jsx';
import {NumberUtils} from 'util/utils';

/**
 * @class Expense
 * @description A table row element to display details of an expense
 * @extends React.Component
 */
class Expense extends React.Component {
    /**
     * Find participant from participants by id
     * @param  {String} participantId
     * @return {Object}
     */
    findParticipant(participantId) {
        return _.find(this.props.participants, (participant => participant.id === participantId));
    }

    /**
     * @return {Component}
     */
    render() {
        var expense = this.props.expense;

        return (
            <tr>
                <td>{expense.name}</td>
                <td>{expense.price}</td>
                <td>{NumberUtils.round(expense.price / expense.participants.length, 1)}</td>
                <td>{expense.participants.map(participant => this.findParticipant(participant).name).join(', ')}</td>
                <td>{this.findParticipant(expense.payer).name}</td>
                <td className="text-right">
                    {
                        !this.props.isRemoveAllowed ? '' :
                        <TrashButton onClick={() => this.props.removeExpenses(this.props.expense)}/>
                    }
                </td>
            </tr>
        );
    }
}

Expense.PropTypes = {
    sheet: React.PropTypes.object.isRequired,
    expense: React.PropTypes.object.isRequired,
    participants: React.PropTypes.array.isRequired
};

export default Expense;