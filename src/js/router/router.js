import _ from 'lodash';
import page from 'page';
import pages from '../constants/pages.js';
import routes from './routes.jsx';

var _currentRoute = null;

/**
 * @class Router
 * @description Handles stuff related to routing
 * e.g registration of routes
 */
class Router {
    /**
     * @constructor
     * @return {Router}
     */
    constructor() {
        console.log('Router init called');
        this.setUpRoutes();
    }

    /**
     * Start listening to page changes
     * @return {undefined}
     */
    start() {
        page({ hashbang: true });
    }

    /**
     * Navigate to next page. Next page is defined in pages config.
     * @return {undefined}
     */
    next() {
        if (_currentRoute && _currentRoute.next) {
            this.navigateTo(pages[_currentRoute.next].href);
        }
    }

    /**
     * Navigate to previous page. Previous page is defined in pages config.
     * @return {undefined}
     */
    prev() {
        if (_currentRoute && _currentRoute.prev) {
            this.navigateTo(pages[_currentRoute.prev].href);
        }
    }

    /**
     * Navigate to given path
     * @param  {string} path
     * @return {undefined}
     */
    navigateTo(path) {
        page(path);
    }

    /**
     * Register all routes defined in routes.jsx
     * @return {undefined}
     */
    setUpRoutes() {
        _.each(routes, this._registerRoute.bind(this));
    }

    /**
     * Return the current route
     * @return {string} Current route
     */
    getCurrentRoute() {
        return _currentRoute;
    }

    /**
     * Proxy function for route callbacks. Records the current page
     * @param  {function} callback  Route callback
     * @param  {object}   route     Route object
     * @return {undefined}
     */
    _onRouteChange(callback, route) {
        _currentRoute = _.find(pages, page => page.href === route);
        callback();
    }

    /**
     * Register callback to given route
     * @private
     * @param  {function} callback
     * @param  {string}   route
     * @return {undefined}
     */
    _registerRoute(callback, route) {
        page(route, () => this._onRouteChange(callback, route));
    }
}

export default new Router();
