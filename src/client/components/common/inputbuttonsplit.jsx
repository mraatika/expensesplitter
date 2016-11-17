import React from 'react';

/**
 * @class InputButtonSplit
 * @description Component that makes a grouped input component
 * out of a button and an input field
 * @extends {ReactComponent}
 */
export default class InputButtonSplit extends React.Component {
    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <div className="split-button">
                {this.props.children[0]}
                <span className="button-container">
                    {this.props.children[1]}
                </span>
            </div>
        );
    }
}