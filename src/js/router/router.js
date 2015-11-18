import _ from 'lodash';
import page from 'page';
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
        _currentRoute = route;
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
