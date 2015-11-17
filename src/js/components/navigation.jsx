'use strict';

import React from 'react';
import {t} from '../dictionary/dictionary';

export class Navigation extends React.Component {

    render() {
        var nextLink = '';
        var prevLink = '';

        if (this.props.next)
            nextLink = <a href={this.props.next.href}>{ t(this.props.next.label) } &gt;&gt;</a>;

        if (this.props.prev)
            prevLink = <a href={this.props.prev.href}>&lt;&lt; {t (this.props.prev.label) }</a>;

        return (
            <nav role="navigation">{ prevLink } { nextLink }</nav>
        );
    }
}
