
function ExtendableError(message) {
    this.name = this.constructor.name;
    this.message = message;
    this.stack = (new Error()).stack;
}

ExtendableError.prototype = Object.create(Error.prototype);
ExtendableError.prototype.constructor = ExtendableError;

// Create a new object, that prototypally inherits from the Error constructor.
export function ValidationError(validationErrors) {
    const message = validationErrors.map((value, key) => `${key}: ${value}`).join(', ');
    ExtendableError.call(this, message);
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

/**
 * @class ValidationError
 * @description Thrown when validation fails
 * @extends {ExtendableError}
 */

// Create a new object, that prototypally inherits from the Error constructor.
export function InvalidArgumentsError(message) {
    ExtendableError.call(this, message);
}

InvalidArgumentsError.prototype = Object.create(ExtendableError.prototype);
InvalidArgumentsError.prototype.constructor = InvalidArgumentsError;