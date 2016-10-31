import React, {PropTypes} from 'react';
import {browserHistory} from 'react-router';
import pages from '../../constants/pages';
import {defer, pick, map} from 'lodash';
import {t} from 'common/dictionary/dictionary';

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
        // defer to allow the pending update to be completed
        defer(() => browserHistory.push(`/sheet/${this.props.sheetId}${link}`));
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
    currentPage: PropTypes.object.isRequired,
    sheetId: PropTypes.string.isRequired
};

export default NavigationSelect;