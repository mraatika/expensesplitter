import {browserHistory} from 'react-router';
import {find} from 'lodash';
import pages from 'client/constants/pages';
import {URLUtils} from 'client/util/utils';

/**
 * Find page config object based on route's page section
 * @param  {string} pageFragment
 * @return {Object}
 */
const _findRouteObject = pageFragment => {
    return find(pages, page => page.href === pageFragment);
};

/**
 * Navigate in given "direction" (next, prev) in workflow
 * @param  {next|prev} prop
 */
const navigateTowards = direction => {
    const location = window.location.href;
    const route = _findRouteObject(location.substring(location.lastIndexOf('/')));
    const pageFragment = route && route[direction] ? pages[route[direction]].href : null;

    if (pageFragment) {
        browserHistory.push(URLUtils.formSubpageURLFromLocation(pageFragment));
    }
};

export default {
    /**
     * Move forward in the workflow
     */
    next() {
        navigateTowards('next');
    },

    /**
     * Move back in the workflow
     */
    prev() {
        navigateTowards('prev');
    },

    /**
     * Navigate to subpage
     * @param  {string} fragment Sub route
     * @param  {string} sheetId
     * @param  {string} [adminKey]
     */
    navigateTo(fragment, sheetId, adminKey) {
        browserHistory.push(URLUtils.formSubpageUrl(fragment, sheetId, adminKey));
    }
};