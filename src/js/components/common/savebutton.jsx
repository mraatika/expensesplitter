import React from 'react';
import classNames from 'classnames';

/**
 * @class SaveButton
 * @description Save button that displays different text/icon depending
 * on current save state
 * @extends {ReactComponent}
 */
export default class SaveButton extends React.Component {

    /**
     * @return {ReactComponent}
     */
    render() {
        const {isSaved, beforeSaveText, afterSaveText} = this.props;
        const buttonClassName = classNames(this.props.className, {
            'button-success': isSaved,
            'button-primary': !isSaved
        });

        return (
            <button
                {...this.props}
                className={buttonClassName}
                aria-label={beforeSaveText}>
                <i className={`fa fa-fw fa-${isSaved ? 'check' : 'save'}`}/>&nbsp;
                { isSaved ? afterSaveText : beforeSaveText }
            </button>
        );
    }
}

SaveButton.defaultProps = {
    isSaved: false,
    beforeSaveText: 'Save',
    afterSaveText: 'Saved'
};

SaveButton.propTypes = {
    /**
     * Should the component display save or saved state
     * @type {Boolean}
     */
    isSaved: React.PropTypes.bool,
    /**
     * Button text before saving is done
     * @type {String}
     */
    beforeSaveText: React.PropTypes.string,
    /**
     * Button text after saving is done
     * @type {String}
     */
    afterSaveText: React.PropTypes.string
};