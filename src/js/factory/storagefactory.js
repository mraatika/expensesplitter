'use strict';

import Constants from '../constants/AppConstants';
import LocalStorageAdapter from '../util/localstorageadapter';

var StorageFactory = {

    create: function() {
        var storage = new LocalStorageAdapter(Constants.STORE_NAME);
        return storage;
    }
};


export default StorageFactory;