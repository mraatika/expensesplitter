import {setLanguage} from 'common/dictionary/dictionary';

/**
 * i18n middleware to set the language used in translations
 * @return {Function}
 */
export default function() {
    /**
     * Actual handler function
     * @param  {Objecct} err Error received
     * @param  {Object} req  Request object
     * @param  {Object} res  Response object
     * @param  {Function} next
     */
    return function i18nMiddleware(req, res, next) {
        setLanguage(req.header('Accept-Language') || 'en');
        next();
    };
}