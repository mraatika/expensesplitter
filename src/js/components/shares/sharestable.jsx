import React from 'react';
import _ from 'lodash';
import ExpensesService from '../../service/expensesservice';
import {t} from '../../dictionary/dictionary';
import Share from './share.jsx';
import ShareSummaryRow from './sharesummaryrow.jsx';

/**
 * @class SharesTable
 * @description Table for displaying shares of each of the participants.
 * @extends ReactComponent
 */
export default class SharesTable extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {expenses, participants} = this.props;
        const expensesService = new ExpensesService({ expenses, participants });
        const balancesAndShares = expensesService.getAllBalancesAndShares();
        // order shares first by balance and the by participant's name
        const shares = _.sortByAll(balancesAndShares, ['balance', 'participantName']);

        return (
            <table className="shares-list u-full-width">
                <thead className="bold">
                    <tr>
                        <th>{ t ('lang.participant') }:</th>
                        <th>{ t ('lang.share') }:</th>
                        <th>{ t ('lang.balance') }:</th>
                    </tr>
                </thead>
                <tbody>
                    { shares.map(share =>
                        <Share key={share.participantName} share={share} />
                    )}
                </tbody>
                <tfoot>
                    <ShareSummaryRow totalSum={expensesService.getTotalSum()} />
                </tfoot>
            </table>
        );
    }
}
