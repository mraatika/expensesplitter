import React from 'react';

/**
 * @class InputButtonSplit
 * @description Component that makes a grouped input component
 * out of a button and an input field
 * @extends {ReactComponent}
 */
export default class InputButtonSplit extends React.Component {

    /**
     * Find
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    _findChildOfType(type) {
        const children = React.Children.toArray(this.props.children);
        return children.find(c => c.type === type);
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        let inputField = this._findChildOfType('input');
        let button = this._findChildOfType('button');

        return (
            <div className="split-button">
                { inputField }
                <span className="button-container">
                    {button}
                </span>
            </div>
        );
    }
}