import React from 'react';
import classNames from 'classnames';
import {t} from '../../dictionary/dictionary';

/**
 * @class TrashButton
 * @description Icon only button with a trash icon
 * @extends React.Component
 */
export class TrashButton extends React.Component {

    render() {
        const iconClassName = classNames(
            this.props.className,
            ['fa', 'fa-trash-o', 'fa-lg', 'fa-fw', 'icon-button']
        );

        return (
            <i
                className={iconClassName}
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

TrashButton.propTypes = {
    onClick: React.PropTypes.func
};