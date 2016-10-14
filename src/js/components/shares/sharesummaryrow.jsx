import React, {PropTypes} from 'react';
import {t} from '../../dictionary/dictionary';

/**
 * @class ShareSummaryRow
 * @description A table row element to display total sum of all the expenses
 * @extends React.Component
 */
class ShareSummaryRow extends React.Component {

    render() {
        return (
            <tr>
                <td>{t('lang.total')}:</td>
                <td colSpan="2">{this.props.totalSum} {this.props.currencySymbol}</td>
            </tr>
        );
    }
}

ShareSummaryRow.defaultProps = {
    totalSum: 0,
    currencySymbol: ''
};

ShareSummaryRow.propTypes = {
    totalSum: PropTypes.number,
    currencySymbol: PropTypes.string
};

export default ShareSummaryRow;
