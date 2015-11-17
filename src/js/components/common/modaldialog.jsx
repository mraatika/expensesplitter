'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';
import _ from 'lodash';
import {Modal} from 'react-bootstrap';

export class ModalDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    open() {
        this.setState({ showModal: true });
    }

    close() {
        if (this.props.onCloseRequest) {
            this.props.onCloseRequest.call(null);
        }

        this.setState({ showModal: false });
    }

    render() {
        var self = this;

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
                            var click = (_.isFunction(button.click)) ? button.click : this.close.bind(self);

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

ModalDialog.defaultProps = { buttons: [{ label: t('lang.close'), icon: 'fa-close' }]};