import {connection} from 'server/database/dbconnector';
import Q from 'kew';

let authCookie;

/**
 * Validate username and password
 * @private
 * @param   {Q} q
 * @param   {string} username
 * @param   {string} password
 * @return  {Q|undefined}
 */
function _validate(q, username, password) {
    if (!username || (typeof username != 'string')) {
        return q.reject('ERROR: Username missing or invalid!');
    }

    if (!password || typeof password != 'string') {
        return q.reject('ERROR: Password missing or invalid!');
    }
}

/**
 * Reset the saved auth cookie
 * @public
 */
export const resetAuthorization = () => {
    authCookie = null;
};

/**
 * Get a authorization cookie from the couch server
 * @public
 * @param  {string} username
 * @param  {string} password
 * @return {Promise}
 */
export const authenticate = (username, password) => {
    const q = Q.defer();

    // check that username and password are valid
    if (_validate(q, username, password)) return q.promise;

    // resolve with cookie if already authenticated
    if (authCookie) {
        q.resolve(authCookie);
        return q.promise;
    }

    // resolve with cookie if already authenticated
    connection.auth(username, password, (err, body, headers) => {
        if (err) {
            q.reject(err);
            return;
        }

        // save the cookie
        authCookie = headers['set-cookie'];

        q.resolve(authCookie);
    });

    return q.promise;
};