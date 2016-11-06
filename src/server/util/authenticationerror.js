/**
 * @class AuthenticationError
 * @description An error thrown if authorization fails (403)
 * @extends {Error}
 */
export default class AuthenticationError extends Error {
    /**
     * @constructor
     * @param       {string} message
     * @return      {AuthenticationError}
     */
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}