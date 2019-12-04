"use strict";
// TODO: Improve documentations
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class used to redefined error instance with encoded error
 */
class APIError extends Error {
    constructor(err, status, code) {
        super(err);
        this.name = err;
        this.status = status;
        this.code = code;
        this.errors = null;
    }
    setErrors(errors) {
        this.errors = errors;
    }
    toJSON() {
        return {
            code: this.code,
            status: this.status,
            errors: this.errors,
            name: this.name,
        };
    }
}
exports.APIError = APIError;
//# sourceMappingURL=error.js.map