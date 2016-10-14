import React, {PropTypes} from 'react';
import {sortByAll} from 'lodash';
import ExpensesService from '../../service/expensesservice';
import {t} from '../../dictionary/dictionary';
import Share from './share.jsx';
import ShareSummaryRow from './sharesummaryrow.jsx';

/**
 * @class SharesTable
 * @description Table for displaying shares of each of the participants.
 * @extends ReactComponent
 */
class SharesTable extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {expenses, participants} = this.props;
        const expensesService = new ExpensesService({ expenses, participants });
        const balancesAndShares = expensesService.getAllBalancesAndShares();
        // order shares first by balance and the by participant's name
        const shares = sortByAll(balancesAndShares, ['balance', 'participantName']);

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
                    {shares.map(share => <Share key={share.participantId} share={share} />)}
                </tbody>
                <tfoot>
                    <ShareSummaryRow totalSum={expensesService.getTotalSum()} />
                </tfoot>
            </table>
        );
    }
}

SharesTable.defaultProps = {
    expenses: [],
    participants: []
};

SharesTable.propTypes = {
    expenses: PropTypes.array,
    participants: PropTypes.array
};

export default SharesTable;