import {t} from 'common/dictionary/dictionary';

/**
 * Handler for handling server errors
 * @return {Function}
 */
export default function(logger) {
    // all params should be defined so that the function is
    // registered as an error handler
    //
    /* eslint-disable no-unused-vars */
    /**
     * Actual handler function
     * @param  {Objecct} err Error received
     * @param  {Object} req  Request object
     * @param  {Object} res  Response object
     * @param  {Function} next
     */
    return function errorHandler(err, req, res, next) {
        let statusCode = err.statusCode;
        let message = err.translatedMessage || t(`error.server.${statusCode}`);

        logger.error('An error happened with a request', err);

        // if connection to the db is down then return 503
        if (err.code === 'ECONNREFUSED') statusCode = 503;

        // if a specified error message was not found for this status then use general error message
        if (message.indexOf('Translation not found for') > -1) message = t('error.server.general');

        res
            .status(statusCode)
            .json({ message });
    };
}