import React, {PropTypes} from 'react';
import {find} from 'lodash';
import TrashButton from 'client/components/common/trashbutton.jsx';
import {NumberUtils} from 'client/util/utils';

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
        return find(this.props.participants, participant => participant.id === participantId);
    }

    /**
     * @return {Component}
     */
    render() {
        const {expense} = this.props;

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
    expense: PropTypes.object.isRequired,
    participants: PropTypes.array.isRequired,
    iRemoveAllowed: PropTypes.bool,
    removeExpenses: PropTypes.func
};

export default Expense;