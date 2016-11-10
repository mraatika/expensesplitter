import {authenticate} from 'server/database/dbauthorization';
import configs from 'server/conf/db.conf.json';

const conf = configs[process.env.NODE_ENV || 'dev'];

/**
 * Authentication middleware (get auth cookie from the db server)
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
    return function authorizationMiddleware(req, res, next) {
        authenticate(conf.username, conf.password)
            .then(() => next())
            .catch(err => next(err));
    };
}