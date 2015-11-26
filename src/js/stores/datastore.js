import AppDispatcher from '../dispatchers/appdispatcher';
import {EventEmitter} from 'events';
import Constants from '../constants/AppConstants';

/**
 * @class DataStore
 * @description Base class for Store classes
 * @extends {EventEmitter}
 */
export default class DataStore extends EventEmitter {

    init(storage) {
        this.storage = storage;

        if (!this.dispatcherIndex) {
            // register store with dispatcher, allowing actions to flow through
            this.dispatcherIndex = AppDispatcher.register(this.handleDispatcherEvent);
        }
    }

    // Allow Controller-View to register itself with store
    addChangeListener(callback) {
        this.on(Constants.EventTypes.CHANGE_EVENT, callback);
    }

    addErrorListener(callback) {
        this.on(Constants.ErrorEventTypes.ERROR_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(Constants.EventTypes.CHANGE_EVENT, callback);
    }

    removeErrorListener(callback) {
        this.removeListener(Constants.ErrorEventTypes.ERROR_EVENT, callback);
    }
    /**
     * Triggers change listeners, firing controller-view callback
     * @param  {String} eventType
     * @event Constants.CHANGE_EVENT
     */
    emitChange(eventType) {
        this.emit(Constants.EventTypes.CHANGE_EVENT, eventType);
    }

    /**
     * Emits an error event firing error callbacks on listeners
     * @param   {String} eventType
     * @param   {Object} errors
     */
    emitError(eventType, errors) {
        this.emit(Constants.ErrorEventTypes.ERROR_EVENT, eventType, errors);
    }

    /**
     * @abstract
     */
    handleDispatcherEvent() {
        throw new Error('Method _handleDispatcherEvent should be implemented in inheriting class!');
    }
}
