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
        const {isSaved, isSaving, beforeSaveText, afterSaveText, onSavingText, ...other} = this.props;
        const buttonClassName = classNames(this.props.className, {
            'button-success': isSaved,
            'button-primary': !isSaved
        });

        return (
            <button
                {...other}
                className={buttonClassName}
                disabled={this.isSaving || this.props.disabled}
                aria-label={beforeSaveText}>
                <i className={`fa fa-fw fa-${isSaving ? 'spinner' : isSaved ? 'check' : 'save'}`}/>&nbsp;
                { isSaving ? onSavingText : isSaved ? afterSaveText : beforeSaveText }
            </button>
        );
    }
}

SaveButton.defaultProps = {
    isSaved: false,
    isSaving: false,
    beforeSaveText: 'Save',
    afterSaveText: 'Saved',
    onSavingText: 'Saving'
};

SaveButton.propTypes = {
    /**
     * Should the component display save or saved state
     * @type {Boolean}
     */
    isSaved: React.PropTypes.bool,
    /**
     * Should the component display saving state
     * @type {Boolean}
     */
    isSaving: React.PropTypes.bool,
    /**
     * Button text before saving is done
     * @type {String}
     */
    beforeSaveText: React.PropTypes.string,
    /**
     * Button text when saving is in process
     * @type {String}
     */
    onSavingText: React.PropTypes.string,
    /**
     * Button text after saving is done
     * @type {String}
     */
    afterSaveText: React.PropTypes.string
};