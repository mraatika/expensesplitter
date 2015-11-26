import LocalStorageAdapter from '../util/localstorageadapter';

var StorageFactory = {

    create: function(storeName) {
        var storage = new LocalStorageAdapter(storeName);
        return storage;
    }
};


export default StorageFactory;