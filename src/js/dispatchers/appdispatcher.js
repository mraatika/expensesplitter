'use strict';

import {Dispatcher} from 'flux';
import Constants from '../constants/AppConstants';

class AppDispatcher extends Dispatcher {

    constructor() {
        super(arguments);
    }

    handleServerAction(action) {
        var payload = {
            source: Constants.ActionSources.SERVER_ACTION,
            action: action
        };

        this.dispatch(payload);
    }

    handleViewAction(action) {
        var payload = {
            source: Constants.ActionSources.VIEW_ACTION,
            action: action
        };

        this.dispatch(payload);
    }
}

export default new AppDispatcher();
