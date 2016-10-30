import {browserHistory} from 'react-router';
import {find} from 'lodash';
import pages from '../constants/pages';
import {URLUtils} from '../util/utils';

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
    const pageHref = route && route[direction] ? pages[route[direction]].href : null;

    if (pageHref) {
        browserHistory.push(URLUtils.formSheetUrlForPage(pageHref));
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
    }
};