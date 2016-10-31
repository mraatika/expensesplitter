import React, {PropTypes} from 'react';
import {t} from 'common/dictionary/dictionary';

/**
 * @class MessageContainer
 * @description A togglable container to display messages with styling chosen by type
 * @extends React.Component
 */
class MessageContainer extends React.Component {

    /**
     * Close the container
     * @private
     * @return  {undefined}
     */
    _close() {
        this.props.onClose();
    }

    /**
     * Get color class name by type
     * @private
     * @param   {string} type
     * @return  {string}
     */
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

    /**
     * @return {ReactComponent}
     */
    render() {
        const className = 'message-container ' + this.props.type;
        const colorClass = 'text-' + this._getColorClass(this.props.type);

        return (
            <div
                style={{ display: (this.props.show) ? 'block' : 'none' }}
                className={className}>

                <i
                    onClick={this._close.bind(this)}
                    style={{ display: (this.props.closable) ? 'block' : 'none' }}
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

MessageContainer.defaultProps = {
    closable: true,
    show: false,
    type: 'info',
    onClose: () => {}
};

MessageContainer.propTypes = {

    /**
     * Should the close button be displayed or not. Defaults to true.
     * @type {boolean}
     */
    closable: PropTypes.bool,

    /**
     * Truthy/falsy flag to indicate whether container is displayed or not. Defaults to false.
     * @type {*}
     */
    show: PropTypes.bool,
    /**
     * Type of the container (visual style). Defaults to 'info'.
     * @type {info|danger|warning|success}
     */
    type: PropTypes.oneOf(['info', 'danger', 'warning', 'success']),
    /**
     * Close callback
     * @type {function}
     */
    onClose: PropTypes.func
};

export default MessageContainer;