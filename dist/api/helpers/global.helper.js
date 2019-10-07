"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const logger_1 = __importDefault(require("../../utils/logger"));
const error_1 = require("../../utils/error");
/**
 * @summary Method used to factorize if we need to return NO_CONTENT
 * @param {any} content To check
 * @param {NextFunction} next Callback if no content
 * @returns {boolean} Return true if success, false if fail
 */
function checkContent(content, next) {
    if (!content) {
        next(new error_1.APIError(http_status_codes_1.default.getStatusText(http_status_codes_1.default.NO_CONTENT), http_status_codes_1.default.NO_CONTENT, 11104));
        return false;
    }
    return true;
}
exports.checkContent = checkContent;
/**
 * @summary Method used to factorize if we need to return NO_CONTENT on array
 * @param {any} content Array to check
 * @param {NextFunction} next Callback if no content
 * @returns {boolean} Return true if success, false if fail
 */
function checkArrayContent(content, next) {
    if (!content || !Array.isArray(content) || content.length === 0) {
        next(new error_1.APIError(http_status_codes_1.default.getStatusText(http_status_codes_1.default.NO_CONTENT), http_status_codes_1.default.NO_CONTENT, 11104));
        return false;
    }
    return true;
}
exports.checkArrayContent = checkArrayContent;
/**
 * @summary MACRO to return UNPROCESSABLE_ENTITY
 * @param {NextFunction} next callback
 * @param {any} e Error to log
 */
function UNPROCESSABLE_ENTITY(next, e) {
    logger_1.default.error(e);
    if (e instanceof error_1.APIError) {
        next(e);
    }
    else {
        next(new error_1.APIError(http_status_codes_1.default.getStatusText(http_status_codes_1.default.UNPROCESSABLE_ENTITY), http_status_codes_1.default.UNPROCESSABLE_ENTITY, 10101));
    }
}
exports.UNPROCESSABLE_ENTITY = UNPROCESSABLE_ENTITY;
/**
 * @summary MACRO to return BAD_REQUEST with error (express-validator)
 * @param {NextFunction} next callback
 * @param {any} e Error to log
 */
function BAD_REQUEST_VALIDATOR(next, e) {
    const error = new error_1.APIError('BAD REQUEST', http_status_codes_1.default.BAD_REQUEST, 11103);
    error.setErrors(e.array());
    next(error);
}
exports.BAD_REQUEST_VALIDATOR = BAD_REQUEST_VALIDATOR;
//# sourceMappingURL=global.helper.js.map