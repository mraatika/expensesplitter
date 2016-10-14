import React, {PropTypes} from 'react';
import {NumberUtils} from '../../util/utils.js';

/**
 * @class Transaction
 * @description A list element representing a transaction
 * @extends {ReactComponent}
 */
class Share extends React.Component {

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

    /**
     * @return {ReactComponent}
     */
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
    share: PropTypes.object.isRequired
};

export default Share;