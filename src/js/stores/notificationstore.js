import makeStore from 'makestore';
import AppDispatcher from '../dispatchers/appdispatcher.js';
import Constants from '../constants/appconstants';
import {t} from '../dictionary/dictionary.js';

/**
 * Notification queue
 * @type {Queue}
 */
let _notifications = [];

/**
 * @class NotificationStore
 * @description Store for notifications
 */
const notificationStore = makeStore({

    dispatcherIndex: AppDispatcher.register(payload => {
        const action = payload.action;

        switch(action.type) {
        case Constants.ErrorEventTypes.SAVE_SHEET:
            notificationStore._addErrorNotification('SAVE_SHEET', action.error);
            notificationStore._emitChange();
            break;
        case Constants.ErrorEventTypes.REMOVE_SHEET:
            notificationStore._addErrorNotification('REMOVE_SHEET', action.error);
            notificationStore._emitChange();
            break;
        case Constants.ErrorEventTypes.LOAD_SHEET:
            notificationStore._addErrorNotification('LOAD_SHEET', action.error);
            notificationStore._emitChange();
            break;
        }
    }),

    /**
     * Get latest notification from the queue
     * @return {Object} A notification object
     */
    getLastNotification() {
        return _notifications.pop();
    },

    /**
     * Emit store's change event
     * @private
     * @return  {undefined}
     */
    _emitChange() {
        notificationStore.emitChange(Constants.EventTypes.NOTIFICATION_ADDED);
    },

    /**
     * Add an error notification to the queue
     * @private
     * @param   {string} eventType
     * @param   {Object} serverError
     * @return  {undefined}
     */
    _addErrorNotification(eventType, serverError) {
        const {statusText, status} = serverError;
        const error = {
            title: t(`errors.${eventType}.title`) + '!',
            message: `${statusText} (${status})`,
            level: 'error',
            autoDismiss: 15
        };

        _notifications.push(error);
    },

    /**
     * Add a success notification to the notifications queue
     * @private
     * @param   {string} eventType
     * @returns {undefined}
     */
    _addSuccessNotification(eventType) {
        const success = {
            title: t(`notifications.${eventType}.title`),
            message: t(`notifications.${eventType}.message`),
            level: 'success'
        };

        _notifications.push(success);
    }
});

export default notificationStore;