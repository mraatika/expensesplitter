'use strict';

import React from 'react';
import ExpensesService from '../../service/expensesservice';
import DataStore from '../../stores/datastore';
import {t} from '../../dictionary/dictionary';
import {Share} from './share.jsx';
import {ShareSummaryRow} from './sharesummaryrow.jsx';

/**
 * @class SharesTable
 * @description Table for displaying shares of each of the participants.
 * @extends React.Component
 */
export class SharesTable extends React.Component {

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

    /**
     * Calculate expenses, shares and related information for the component
     * @return {Object}
     *     {Array} balancesAndShares
     *     {Number} totalSum
     */
    _getCurrentState() {
        var {expenses, participants} = this.props;
        var expensesService = new ExpensesService({ expenses, participants });
        var balancesAndShares = expensesService.getAllBalancesAndShares();

        return {
            shares: balancesAndShares,
            totalSum: expensesService.getTotalSum()
        };
    }

    _onChange() {
        this.setState(this._getCurrentState());
    }

    componentDidMount() {
        DataStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        DataStore.removeChangeListener(this._onChange);
    }

    render() {
        var shares = this.state.shares;

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
