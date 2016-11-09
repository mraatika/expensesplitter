import {connect} from 'server/database/dbconnector';

let authCookie;

/**
 * Validate username and password
 * @private
 * @param   {Q} q
 * @param   {string} username
 * @param   {string} password
 * @return  {Q|undefined}
 */
function _isValid(username, password) {
    if (!username || (typeof username != 'string')) {
        return false;
    }

    if (!password || typeof password != 'string') {
        return false;
    }

    return true;
}

/**
 * Reset the saved auth cookie
 * @public
 */
export const resetAuthorization = () => {
    authCookie = null;
};

export const getCookie = () => authCookie;

/**
 * Get a authorization cookie from the couch server
 * @public
 * @param  {string} username
 * @param  {string} password
 * @return {Promise}
 */
export const authenticate = (username, password) => {

    return new Promise((resolve, reject) => {
        // check that username and password are valid
        if (!_isValid(username, password)) {
            return reject(new Error('Username or password invalid!'));
        }

        // resolve with cookie if already authenticated
        if (authCookie) return resolve(authCookie);

        // resolve with cookie if already authenticated
        connect(username, password).auth(username, password, (err, body, headers) => {
            if (err) return reject(err);

            // save the cookie
            authCookie = headers['set-cookie'];

            resolve(authCookie);
        });
    });
};