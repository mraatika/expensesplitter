import React from 'react';
import Router from '../../router/router.js';
import pages from '../../constants/pages';
import _ from 'lodash';
import {t} from '../../dictionary/dictionary';

/**
 * @class NavigationSelect
 * @description A select input used to navigate directly to a page
 * @extends {React.Component}
 */
export default class NavigationSelect extends React.Component {

    /**
     * Navigate to selected page
     * @private
     * @return {undefined}
     */
    _onChange() {
        const link = this._select.options[this._select.selectedIndex].value;
        // defer to allow the pending update to be completed
        _.defer(() => Router.navigateToSheetURL(link));
    }

    /**
     * Render the component
     * @return {ReactComponent}
     */
    render() {
        const {href:currentRoute} = this.props.currentPage;
        const navigablePages = _.pick(pages, page => page.displayInNavigation);

        return (
            <select
                className={this.props.className}
                ref={(c) => this._select = c}
                defaultValue={currentRoute}
                onChange={this._onChange.bind(this)}>
                {
                    _.map(navigablePages, (page, key) => {
                        const isCurrentPage = page.href == currentRoute;
                        return <option key={key} value={page.href} className={isCurrentPage ? 'current' : ''}>
                            {t(page.label)}
                        </option>;
                    })
                }
            </select>
        );
    }
}