import {omit} from 'ramda';

/**
 * @class LocalStorageAdapter
 * @description Storage that syncs with localStorage
 */
export default class LocalStorageAdapter {

    /**
     * @constructor
     * @param {String} storeName
     * @param {Object} initialData
     */
    constructor(storeName, initialData = {}) {
        if (!storeName) throw new Error('IllegalArgumentsException: storeName missing!');
        this.storeName = storeName;
        this.setAll({ ...initialData, ...this.load() });
    }
    /**
     * Get a value from the store
     * @param  {String} key
     * @return {*}
     */
    get(key) {
        return key ? this._data[key] : null;
    }
    /**
     * Return the whole dataset
     * @return {Object}
     */
    getAll() {
        return { ...this._data };
    }
    /**
     * Set value to the store
     * @param  {String} key
     * @param  {*} value
     */
    set(key, value) {
        this._data[key] = value;
        this.save();
    }
    /**
     * Replace current dataset with given
     * @param  {Object} value
     */
    setAll(value) {
        this._data = { ...value };
        this.save();
    }
    /**
     * Remove value from the store
     * @param  {String} key
     */
    remove(key) {
        this._data[key] = null;
        this.save();
    }

    /**
     * Save data to localStorage
     */
    save() {
        this._data = omit(val => val === null || val === void 0, this._data);
        localStorage.setItem(this.storeName, JSON.stringify(this._data));
    }

    /**
     * Remove the whole dataset from localStorage
     */
    clear() {
        this._data = {};
        localStorage.removeItem(this.storeName);
    }

    /**
     * Load data from localStorage
     * @return {Object}
     */
    load() {
        let data = localStorage.getItem(this.storeName);

        try {
            data = JSON.parse(data);
        } catch(e) {
            console.error('Error while tring to parse localstorage data', e);
        }

        return data || {};
    }
}

