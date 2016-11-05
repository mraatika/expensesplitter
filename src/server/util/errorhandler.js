import {t, setLanguage} from 'common/dictionary/dictionary';

/**
 * Handler for handling server errors
 * @return {Function}
 */
export const errorHandler = (logger) => {
    // all params should be defined so that the function is
    // registered as an error handler
    //
    /* eslint no-unused-vars: false */
    /**
     * Actual handler function
     * @param  {Objecct} err Error received
     * @param  {Object} req  Request object
     * @param  {Object} res  Response object
     * @param  {Function} next
     */
    return (err, req, res, next) => {
        let statusCode = err.statusCode;
        let message = t(`error.server.${statusCode}`);

        logger.error('An error happened with a request', err);

        // use translation language from the request header
        setLanguage(req.header('Accept-Language') || 'en');

        // if connection to the db is down then return 503
        if (err.code === 'ECONNREFUSED') statusCode = 503;

        // if a specified error message was not found for this status then use general error message
        if (message.indexOf('Translation not found for') > -1) message = t('error.server.general');

        res
            .status(statusCode)
            .json({ message });
    };
};