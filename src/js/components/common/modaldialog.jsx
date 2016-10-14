import React, {PropTypes} from 'react';
import {t} from '../../dictionary/dictionary';
import {isFunction} from 'lodash';
import {Modal} from 'react-bootstrap';

/**
 * @class ModalDialog
 * @description Wrapper for react-bootstrap's modal component
 * @extends {ReactComponent}
 */
class ModalDialog extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     * @return {ModalDialog}
     */
    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    /**
     * Open the modal dialog
     * @return {undefined}
     */
    open() {
        this.setState({ showModal: true });
    }

    /**
     * Close the modal dialog
     * @return {undefined}
     */
    close() {
        this.props.onCloseRequest();
        this.setState({ showModal: false });
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <Modal
                show={this.state.showModal}
                onHide={this.close.bind(this)}>

                <Modal.Header>
                    <Modal.Title>{this.props.header}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.props.children}
                </Modal.Body>

                <Modal.Footer>
                    <div className="button-container">
                    {
                        this.props.buttons.map((button, i) => {
                            var click = (isFunction(button.click)) ? button.click : this.close.bind(this);

                            return <button key={i} onClick={click} className={ button.buttonStyle ? ('button-' + button.buttonStyle) : '' }>
                                <i className={ 'fa fa-fw fa-lg' + (button.icon ? ' ' + button.icon : '') } />
                                { button.label }
                            </button>;
                        })
                    }
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalDialog.defaultProps = {
    buttons: [{ label: t('lang.close'), icon: 'fa-close' }],
    onCloseRequest: () => {}
};

ModalDialog.propTypes = {
    /**
     * A callback fn called before closing
     * @type {function}
     */
    onCloseRequest: PropTypes.func,
    /**
     * An array of button definition objects. Object should
     * label property (text on the button) and icon class name.
     * @example
     *     [{ label: 'Close', icon; 'fa-close' }]
     * @type {array}
     */
    buttons: PropTypes.array,
    /**
     * Text on the dialog header
     * @type {string}
     */
    header: PropTypes.string
};

export default ModalDialog;