import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * @class SaveButton
 * @description Save button that displays different text/icon depending
 * on current save state
 * @extends {ReactComponent}
 */
class SaveButton extends React.Component {

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
    isSaved: PropTypes.bool,
    /**
     * Should the component display saving state
     * @type {Boolean}
     */
    isSaving: PropTypes.bool,
    /**
     * Button text before saving is done
     * @type {String}
     */
    beforeSaveText: PropTypes.string,
    /**
     * Button text when saving is in process
     * @type {String}
     */
    onSavingText: PropTypes.string,
    /**
     * Button text after saving is done
     * @type {String}
     */
    afterSaveText: PropTypes.string
};

export default SaveButton;