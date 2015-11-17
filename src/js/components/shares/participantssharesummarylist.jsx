'use strict';

import React from 'react';
import ParticipantSharesSummary from './participantssharesummary.jsx';
import {t} from '../../dictionary/dictionary';
import ExpensesService from '../../service/expensesservice';

/**
 * @class ParticipantsShareSummary
 * @description Section for displaying shares of all of the participants
 * @extends React.Component
 */
class ParticipantsShareSummary extends React.Component {

    render() {
        var sharesAndBalances = this.props.sharesAndBalances;
        var expenses = this.props.expenses;
        var participants = this.props.participants;
        var expensesService = new ExpensesService({ expenses: expenses });

        return (
            <section>
                <h2>{ t('shares.participants_expenses') }:</h2>
                {
                    sharesAndBalances.map(share =>
                        <ParticipantSharesSummary
                            participants={participants}
                            share={share}
                            expenses={expensesService.findExpensesByParticipant(share.participantId)} />
                    )
                }
            </section>
        );
    }
}

export default ParticipantsShareSummary;
