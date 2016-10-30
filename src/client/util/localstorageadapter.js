import {extend, omit} from 'lodash';

/**
 * Storage that syncs with localStorage
 * @constructor
 * @param {string} storeName
 * @param {Object} initialData
 */
const LocalStorageAdapter = function(storeName, initialData = {}) {
    if (!storeName) throw new Error('IllegalArgumentsException: storeName missing!');
    this.storeName = storeName;
    this.setAll(extend({}, initialData, this.load()));
};
/**
 * Get a value from the store
 * @param  {string} key
 * @return {*}
 */
LocalStorageAdapter.prototype.get = function(key) {
    return key ? this._data[key] : null;
};
/**
 * Return the whole dataset
 * @return {Object}
 */
LocalStorageAdapter.prototype.getAll = function() {
    return extend({}, this._data);
};
/**
 * Set value to the store
 * @param  {string} key
 * @param  {*} value
 */
LocalStorageAdapter.prototype.set = function(key, value) {
    this._data[key] = value;
    this.save();
};
/**
 * Replace current dataset with given
 * @param  {Object} value
 */
LocalStorageAdapter.prototype.setAll = function(value) {
    this._data = extend({}, value);
    this.save();
};
/**
 * Remove value from the store
 * @param  {string} key
 */
LocalStorageAdapter.prototype.remove = function(key) {
    this._data[key] = null;
    this.save();
};

/**
 * Save data to localStorage
 */
LocalStorageAdapter.prototype.save = function() {
    this._data = omit(this._data, (val => val === null || val === void 0 ));
    localStorage.setItem(this.storeName, JSON.stringify(this._data));
};

/**
 * Remove the whole dataset from localStorage
 */
LocalStorageAdapter.prototype.clear = function() {
    this._data = {};
    localStorage.removeItem(this.storeName);
};

/**
 * Load data from localStorage
 * @return {Object}
 */
LocalStorageAdapter.prototype.load = function() {
    let data = localStorage.getItem(this.storeName);

    try {
        data = JSON.parse(data);
    } catch(e) {
        console.error('Error while tring to parse localstorage data', e);
    }

    return data || {};
};

export default LocalStorageAdapter;


