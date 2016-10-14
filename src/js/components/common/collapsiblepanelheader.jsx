import React, {PropTypes} from 'react';

/**
 * @class CollapsiblePanelHeader
 * @description Header for the collapsible expenses list
 * @extends {ReactComponent}
 */
class CollapsiblePanelHeader extends React.Component {

    /**
     * @constructor
     * @see CollapsiblePanelHeader.propTypes for params
     */

    /**
     * @return {ReactComponent}
     */
    render() {
        const {onExpand, headerText, isExpanded} = this.props;
        let toggleButton = '';

        // only if onExpand callback is defined is the toggle button relevant
        if (onExpand) {
            toggleButton = <i className={'u-pull-right fa fa-' + (isExpanded ? 'minus' : 'plus') + '-square-o'}/>;
        }

        return (
            <div className="wrap-content" onClick={onExpand}>
                <span className="u-pull-left bold">{headerText}</span>
                {toggleButton}
            </div>
        );
    }
}

/**
 * Default properties
 * @type {Object}
 */
CollapsiblePanelHeader.defaultProps = {
    onExpand: () => {}
};

/**
 * Constructor param types
 * @type {object}
 */
CollapsiblePanelHeader.propTypes = {
    /**
     * Callback function for the collapse toggle button.
     * If omitted the component doesn't have the toggle button.
     * @type {function}
     */
    onExpand: PropTypes.func,
    /**
     * Header text
     * @type {string}
     */
    headerText: PropTypes.string,
    /**
     * Collapsible's current state
     * @type {boolean}
     */
    isExpanded: PropTypes.bool
};

export default CollapsiblePanelHeader;