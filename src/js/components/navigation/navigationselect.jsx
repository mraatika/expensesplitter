import React from 'react';
import page from 'page';
import pages from '../../constants/pages';
import _ from 'lodash';
import {t} from '../../dictionary/dictionary';
import Router from '../../router/router';

/**
 * @class NavigationSelect
 * @description A select input used to navigate directly to a page
 * @extends {React.Component}
 */
export class NavigationSelect extends React.Component {

    /**
     * Navigate to selected page
     * @private
     * @return {undefined}
     */
    _onChange() {
        let link = this._select.options[this._select.selectedIndex].value;
        // defer to allow the pending update to be completed
        _.defer(() => page(link));
    }

    /**
     * Render the component
     * @return {ReactComponent}
     */
    render() {
        let currentRoute = Router.getCurrentRoute();

        return (
            <select
                className={this.props.className}
                ref={(c) => this._select = c}
                defaultValue={currentRoute}
                onChange={this._onChange.bind(this)}>
                {
                    _.map(pages, (page, key) => {
                        let isCurrentPage = page.href == currentRoute;
                        return <option key={key} value={page.href} className={isCurrentPage ? 'current' : ''}>
                            {t(page.label)}
                        </option>;
                    })
                }
            </select>
        );
    }
}