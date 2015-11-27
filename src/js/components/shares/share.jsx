import React from 'react';
import {NumberUtils} from '../../util/utils';

/**
 * @class Share
 * @description A table row element displaying participant's share of expenses
 * @extends React.Component
 */
export default class Share extends React.Component {

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
        const {share} = this.props;

        return (
            <tr>
                <td className="share-participant">
                    {share.participantName}
                </td>
                <td className="share-share-amount">
                    {NumberUtils.round(share.amount, 1)}
                </td>
                <td className={'share-balance' + this.getBalanceClassName(share.balance)}>
                    {NumberUtils.round(share.balance, 1)}
                </td>
            </tr>
        );
    }
}

Share.propTypes = {
    /**
     * A Share object
     * @type {object}
     */
    share: React.PropTypes.object
};
