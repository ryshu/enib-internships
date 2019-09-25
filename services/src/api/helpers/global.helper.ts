import httpStatus from 'http-status-codes';
import { NextFunction } from 'express';

import logger from '../../utils/logger';

import { APIError } from '../../utils/error';

/**
 * @summary Method used to factorize if we need to return NO_CONTENT
 * @param {any} content To check
 * @param {NextFunction} next Callback if no content
 * @returns {boolean} Return true if success, false if fail
 */
export function checkContent(content: any, next: NextFunction): boolean {
    if (!content) {
        next(
            new APIError(
                httpStatus.getStatusText(httpStatus.NO_CONTENT),
                httpStatus.NO_CONTENT,
                11104,
            ),
        );
        return false;
    }
    return true;
}

/**
 * @summary Method used to factorize if we need to return NO_CONTENT on array
 * @param {any} content Array to check
 * @param {NextFunction} next Callback if no content
 * @returns {boolean} Return true if success, false if fail
 */
export function checkArrayContent(content: any, next: NextFunction): boolean {
    if (!content || !Array.isArray(content) || content.length === 0) {
        next(
            new APIError(
                httpStatus.getStatusText(httpStatus.NO_CONTENT),
                httpStatus.NO_CONTENT,
                11104,
            ),
        );
        return false;
    }
    return true;
}

/**
 * @summary MACRO to return UNPROCESSABLE_ENTITY
 * @param {NextFunction} next callback
 * @param {any} e Error to log
 */
export function UNPROCESSABLE_ENTITY(next: NextFunction, e: any): void {
    logger.error(e);
    if (e instanceof APIError) {
        next(e);
    } else {
        next(
            new APIError(
                httpStatus.getStatusText(httpStatus.UNPROCESSABLE_ENTITY),
                httpStatus.UNPROCESSABLE_ENTITY,
                10101,
            ),
        );
    }
}

/**
 * @summary MACRO to return BAD_REQUEST with error (express-validator)
 * @param {NextFunction} next callback
 * @param {any} e Error to log
 */
export function BAD_REQUEST_VALIDATOR(next: NextFunction, e: any): void {
    const error = new APIError('BAD REQUEST', httpStatus.BAD_REQUEST, 11103);
    error.setErrors(e.array());
    next(error);
}
