import _ from 'lodash';
import page from 'page';
import pages from '../constants/pages.js';
import routes from './routes.jsx';
import {URLUtils} from '../util/utils.js';

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
        this.setUpRoutes();
    }

    /**
     * Start listening to page changes
     * @return {undefined}
     */
    start() {
        page({ hashbang: false });
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
     * Navigate to a path that's prepended with sheet and it's id
     * @param  {string} path
     * @param  {string} [sheetId]
     * @return {undefined}
     */
    navigateToSheetURL(path, sheetId) {
        // extract sheet id from location
        sheetId = sheetId || URLUtils.getCurrentSheetId();

        // if no sheetId is found then navigate to path without sheet id
        if (!sheetId) return this.navigateTo(path);

        const sheetURLPath = `/sheet${sheetId ? ('/' + sheetId) : ''}${path}`;
        page(sheetURLPath);
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
    _onRouteChange(callback, route, ctx, next) {
        const routePagePart = route.substring(route.lastIndexOf('/'));
        _currentRoute = _.find(pages, page => page.href === routePagePart);
        callback(ctx, next);
    }

    /**
     * Register callback to given route
     * @private
     * @param  {function} callback
     * @param  {string}   route
     * @return {undefined}
     */
    _registerRoute(callback, route) {
        page(route, (ctx, next) => this._onRouteChange(callback, route, ctx, next));
    }
}

export default new Router();
