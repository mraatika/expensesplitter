/**
 * @class ConflictError
 * @description An error thrown if there's a conflict in update (status code 409)
 * @extends {Error}
 */
export default class ConflictError extends Error {
    /**
     * @constructor
     * @param       {string} message
     * @return      {ConflictError}
     */
    constructor(message) {
        super(message);
        this.statusCode = 409;
        this.translatedMessage = message;
    }
}