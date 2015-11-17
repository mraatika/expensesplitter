'use strict';

import _ from 'lodash';

var LocalStorageAdapter = function(storeName) {
    if (!storeName) throw new Error('IllegalArgumentsException: storeName missing!');
    this.storeName = storeName;
    this._data = this.load();
};

LocalStorageAdapter.prototype.get = function(key) {
    return key ? this._data[key] : null;
};

LocalStorageAdapter.prototype.getAll = function() {
    return this._data;
};

LocalStorageAdapter.prototype.set = function(key, value) {
    this._data[key] = value;
    this.save();
};

LocalStorageAdapter.prototype.remove = function(key) {
    this._data[key] = null;
    this.save();
};

LocalStorageAdapter.prototype.save = function() {
    this._data = _.omit(this._data, (val => val === null || val === void 0 ));
    localStorage.setItem(this.storeName, JSON.stringify(this._data));
};

LocalStorageAdapter.prototype.clear = function() {
    this._data = {};
    localStorage.removeItem(this.storeName);
};

LocalStorageAdapter.prototype.load = function() {
    var data = localStorage.getItem(this.storeName);

    if (data) {
        try {
            data = JSON.parse(data);
        } catch(e) {
            console.error('Error while tring to parse localstorage data', e);
        }
    }

    return data || {};
};

export default LocalStorageAdapter;


