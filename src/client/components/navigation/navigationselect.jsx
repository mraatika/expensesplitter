import React, {PropTypes} from 'react';
import {pick, map} from 'lodash';
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
        const navigablePages = pick(pages, page => page.displayInNavigation);

        return (
            <select
                className={this.props.className}
                ref={(c) => this._select = c}
                defaultValue={currentRoute}
                onChange={this._onChange.bind(this)}>
                {
                    map(navigablePages, (page, key) => {
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

NavigationSelect.propTypes = {
    currentPage: PropTypes.object.isRequired
};

export default NavigationSelect;