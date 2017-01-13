import React, {PropTypes} from 'react';
import {pickBy} from 'ramda';
import {t} from 'common/dictionary/dictionary';
import RouterService from 'client/router/routerservice';
import pages from 'client/constants/pages';
import {URLUtils} from 'client/util/utils';

/**
 * @class NavigationSelect
 * @description A select input used to navigate directly to a page
 * @extends {React.Component}
 */
class NavigationSelect extends React.Component {

    /**
     * Navigate to selected page
     * @private
     * @return {undefined}
     */
    _onChange() {
        const link = this._select.options[this._select.selectedIndex].value;
        RouterService.navigateTo(URLUtils.formSubpageURLFromLocation(link));
    }

    /**
     * Render the component
     * @return {ReactComponent}
     */
    render() {
        const {href:currentRoute} = this.props.currentPage;
        const navigablePages = pickBy(page => page.displayInNavigation, pages);
        const pageOptions = [];

        for (const key in navigablePages) {
            const page = navigablePages[key];
            const isCurrentPage = page.href == currentRoute;

            const option = (
                <option key={key} value={page.href} className={isCurrentPage ? 'current' : ''}>
                    {t(page.label)}
                </option>
            );

            pageOptions.push(option);
        }

        return (
            <select
                className={this.props.className}
                ref={(c) => this._select = c}
                defaultValue={currentRoute}
                onChange={this._onChange.bind(this)}>
                { pageOptions }
            </select>
        );
    }
}

NavigationSelect.propTypes = {
    currentPage: PropTypes.object.isRequired
};

export default NavigationSelect;