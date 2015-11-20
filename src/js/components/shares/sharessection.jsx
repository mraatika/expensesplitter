'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';
import SharesTable from './sharestable.jsx';

/**
 * @class SharesSection
 * @description Section for displaying shares of all the participants. Mainly
 * a wrapper for the SharesTable component.
 * @extends ReactComponent
 */
export default class SharesSection extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <div>
                <h2>{ t('lang.share_plural') }</h2>
                <SharesTable {...this.props} />
            </div>
        );
    }
}
