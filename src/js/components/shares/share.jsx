'use strict';

import React from 'react';
import {Number} from '../../util/utils';

/**
 * @class Share
 * @description A table row element displaying participant's share of expenses
 * @extends React.Component
 */
export class Share extends React.Component {

    /**
     * Return class name that marks balance as positive or negative.
     * @param  {Number} balance
     * @returns {String}
     */
    getBalanceClassName(balance) {
        if (balance > 0) return ' positive';
        if (balance < 0) return ' negative';
        return '';
    }

    render() {
        var share = this.props.share;

        return (
            <tr>
                <td className="share-participant">
                    {share.participantName}
                </td>
                <td className="share-share-amount">
                    {Number.round(share.amount, 1)}
                </td>
                <td className={'share-balance' + this.getBalanceClassName(share.balance)}>
                    {Number.round(share.balance, 1)}
                </td>
            </tr>
        );
    }
}
