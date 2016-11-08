import LocalStorageAdapter from 'client/util/localstorageadapter';

/**
 * Export create function for creating localstorage adapter
 * @param  {string} storeName
 * @param  {object} initialData
 * @return {LocalStorageAdapter}
 */
export default function create(storeName, initialData) {
    return new LocalStorageAdapter(storeName, initialData);
}