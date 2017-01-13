import React, {PropTypes} from 'react';
import {t} from 'common/dictionary/dictionary';
import Share from 'client/components/shares/share.jsx';
import ShareSummaryRow from 'client/components/shares/sharesummaryrow.jsx';
import {getTotalSum} from 'client/service/expensesservice';

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
        const {expenses, sharesAndBalances} = this.props;
        const totalSum = getTotalSum(expenses);

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
                    {sharesAndBalances.map(share => <Share key={share.participantId} share={share} />)}
                </tbody>
                <tfoot>
                    <ShareSummaryRow
                        totalSum={totalSum}
                        currencySymbol={this.props.currencySymbol} />
                </tfoot>
            </table>
        );
    }
}

SharesTable.defaultProps = {
    expenses: [],
    sharesAndBalances: [],
    currencySymbol: ''
};

SharesTable.propTypes = {
    expenses: PropTypes.array,
    sharesAndBalances: PropTypes.array,
    currencySymbol: PropTypes.string
};

export default SharesTable;