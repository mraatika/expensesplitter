import React from 'react';
import _ from 'lodash';
import ExpensesService from '../../service/expensesservice';
import SheetStore from '../../stores/sheetstore.js';
import {t} from '../../dictionary/dictionary';
import Share from './share.jsx';
import {ShareSummaryRow} from './sharesummaryrow.jsx';

/**
 * @class SharesTable
 * @description Table for displaying shares of each of the participants.
 * @extends ReactComponent
 */
export default class SharesTable extends React.Component {

    /**
     * @constructor
     * @param  {Object} props
     *     {Array} expenses
     *     {Array} participants
     */
    constructor(props) {
        super(props);

        this.state = this._getCurrentState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetStore.removeChangeListener(this._onChange);
    }

    /**
     * Calculate expenses, shares and related information for the component
     * @return {Object}
     *     {Array} balancesAndShares
     *     {Number} totalSum
     */
    _getCurrentState() {
        const {expenses, participants} = this.props;
        const expensesService = new ExpensesService({ expenses, participants });
        const balancesAndShares = expensesService.getAllBalancesAndShares();

        return {
            shares: balancesAndShares,
            totalSum: expensesService.getTotalSum()
        };
    }

    /**
     * Callback for SheetStore's events
     * @private
     * @return {undefined}
     */
    _onChange() {
        this.setState(this._getCurrentState());
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        // order shares first by balance and the by participant's name
        const shares = _.sortByAll(this.state.shares, ['balance', 'participantName']);

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
                    <ShareSummaryRow totalSum={this.state.totalSum} />
                </tfoot>
            </table>
        );
    }
}
