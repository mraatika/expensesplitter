import React from 'react';

/**
 * @class CollapsiblePanelHeader
 * @description Header for the collapsible expenses list
 * @extends {ReactComponent}
 */
export default class CollapsiblePanelHeader extends React.Component {

    /**
     * @constructor
     * @see CollapsiblePanelHeader.propTypes for params
     */

    /**
     * @return {ReactComponent}
     */
    render() {
        const onExpand = this.props.onExpand;
        let toggleButton = '';

        // only if onExpand callback is defined is the toggle button relevant
        if (onExpand) {
            toggleButton = <i className={'u-pull-right fa fa-' + (this.props.isExpanded ? 'minus' : 'plus') + '-square-o'}/>;
        }

        return (
            <div className="wrap-content" onClick={onExpand || function() {}}>
                <span className="u-pull-left bold">{this.props.headerText}</span>
                {toggleButton}
            </div>
        );
    }
}

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
    onExpand: React.PropTypes.func,
    /**
     * Header text
     * @type {string}
     */
    headerText: React.PropTypes.string,
    /**
     * Collapsible's current state
     * @type {boolean}
     */
    isExpanded: React.PropTypes.bool
};