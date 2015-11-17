'use strict';

import _ from 'lodash';
import page from 'page';
import routes from './routes.jsx';

var Router = function() {
    this.setUpRoutes();
};

Router.prototype.start = function() {
    page({ hashbang: true });
};

Router.prototype.setUpRoutes = function() {
    _.each(routes, this.registerRoute);
};

Router.prototype.registerRoute = function(callback, route) {
    page(route, callback);
};

export default Router;

