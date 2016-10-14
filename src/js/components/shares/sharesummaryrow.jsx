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
                <td colSpan="2">{this.props.totalSum}</td>
            </tr>
        );
    }
}

ShareSummaryRow.defaultProps = {
    totalSum: 0
};

ShareSummaryRow.propTypes = {
    totalSum: PropTypes.number
};

export default ShareSummaryRow;
