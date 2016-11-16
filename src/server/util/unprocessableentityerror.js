/**
 * @class UnprocessableEntityError
 * @description An error thrown if validation fails (status code 422)
 * @extends {Error}
 */
export default class UnprocessableEntityError extends Error {
    /**
     * @constructor
     * @param       {string} message
     * @return      {UnprocessableEntityError}
     */
    constructor(message) {
        super(message);
        this.statusCode = 422;
        this.translatedMessage = message;
    }
}