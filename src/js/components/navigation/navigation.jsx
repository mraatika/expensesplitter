'use strict';

import React from 'react';
import {t} from '../../dictionary/dictionary';
import {NavigationSelect} from './navigationselect.jsx';

/**
 * @class Navigation
 * @description Navigation component for pages
 * @extends {React.Component}
 */
export class Navigation extends React.Component {

    render() {
        let nextLink = '';
        let prevLink = '';

        if (this.props.prev) {
            prevLink = <a href={this.props.prev.href} className="button u-full-width">
                <i className="fa fa-angle-double-left"></i>&nbsp;
                {t (this.props.prev.label) }
            </a>;
        }

        if (this.props.next) {
            nextLink = <a href={this.props.next.href} className="button u-full-width">
                { t(this.props.next.label) }&nbsp;
                <i className="fa fa-angle-double-right"></i>
            </a>;
        }

        return (
            <nav role="navigation" className="row">
                <div className="three columns">
                    { prevLink }
                </div>
                <div className="one column">&nbsp;</div>
                <div className="four columns">
                    <NavigationSelect className="u-full-width" />
                </div>
                <div className="one column">&nbsp;</div>
                <div className="three columns">
                    { nextLink }
                </div>
            </nav>
        );
    }
}
