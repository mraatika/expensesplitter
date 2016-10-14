import React, {PropTypes} from 'react';
import {t} from '../../dictionary/dictionary';

/**
 * @class MessageContainer
 * @description A togglable container to display messages with styling chosen by type
 * @extends React.Component
 */
class MessageContainer extends React.Component {

    /**
     * @constructor
     * @param  {Object} props
     *     {String} type
     */
    constructor(props) {
        super(props);
        this.state = { isOpen: this.props.show };
    }

    /**
     * Set isOpen state when props change
     * @param  {Object} newProps
     * @return {undefined}
     */
    componentWillReceiveProps(newProps) {
        this.setState({ isOpen: newProps.show });
    }

    /**
     * Close the container
     * @private
     * @return  {undefined}
     */
    _close() {
        this.props.onClose();
        this.setState({ isOpen: false });
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
                style={{ display: (this.state.isOpen) ? 'block' : 'none' }}
                className={className}>

                <i
                    onClick={this._close.bind(this)}
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
    show: false,
    type: 'info',
    onClose: () => {}
};

MessageContainer.propTypes = {
    /**
     * Truthy/falsy flag to indicate whether container is displayed or not.
     * @type {*}
     */
    show: PropTypes.bool,
    /**
     * Type of the container (visual style)
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