'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';

/**
 * @class TrashButton
 * @description Icon only button with a trash icon
 * @extends React.Component
 */
export class TrashButton extends React.Component {

    render() {
        return (
            <i
                className="fa fa-trash-o fa-lg fa-fw icon-button"
                aria-role="button"
                aria-label={ t('lang.remove') }
                title={ t('lang.remove') }
                onClick={this.props.onClick} />
        );
    }
}

TrashButton.defaultProps = {
    onClick: () => {}
};