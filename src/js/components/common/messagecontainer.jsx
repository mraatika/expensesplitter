import React from 'react';
import {t} from '../../dictionary/dictionary';

/**
 * @class MessageContainer
 * @description A togglable container to display messages with styling chosen by type
 * @extends React.Component
 */
export class MessageContainer extends React.Component {

    /**
     * @constructor
     * @param  {Object} props
     *     {String} type
     */
    constructor(props) {
        super(props);
        this.state = { isOpen: this.props.openOnMount };
    }

    open() {
        this.setState({ isOpen: true });
    }

    close() {
        this.setState({ isOpen: false });
    }

    _getColorClass(type) {
        switch(type) {
        case 'info':
            return 'blue';
        case 'success':
            return 'green';
        case 'warning':
            return 'yellow';
        case 'danger':
            return 'red';
        default:
            return 'black';
        }
    }

    render() {
        const className = 'message-container ' + this.props.type;
        const colorClass = 'text-' + this._getColorClass(this.props.type);

        return (
            <div
                style={{ display: (this.state.isOpen) ? 'block' : 'none' }}
                className={className}>

                <i
                    onClick={this.close.bind(this)}
                    aria-role="button"
                    className={'close-button fa fa-times u-pull-right ' + colorClass}
                    title={t('lang.close')} />

                <i
                    aria-hidden={true}
                    className={'fa fa-info-circle fa-fw fa-lg ' + colorClass} />

                {this.props.children}

            </div>
        );
    }
}