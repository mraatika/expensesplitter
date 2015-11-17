'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';

/**
 * @class ShareSummaryRow
 * @description A table row element to display total sum of all the expenses
 * @extends React.Component
 */
export class ShareSummaryRow extends React.Component {

    render() {
        return (
            <tr>
                <td>{t('lang.total')}:</td>
                <td colSpan="2">{this.props.totalSum}</td>
            </tr>
        );
    }
}
