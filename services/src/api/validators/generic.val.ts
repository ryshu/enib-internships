import { Schema } from 'express-validator';
import { cloneDeep } from 'lodash';

/**
 * @summary Macro to generate ID validator
 * @param {string} id id field name
 * @param {string} msg `${msg} must be an integer`
 * @returns {Schema} Express validator schema for 'id' validation
 */
export function namedID(id: string, msg: string): Schema {
    return cloneDeep({
        [id]: {
            in: ['params'],
            isInt: { errorMessage: `${msg} must be an integer` },
            exists: { errorMessage: `${msg} must be defined` },
            toInt: true,
        },
    });
}

export const ID: Schema = namedID('id', 'Identifier');
export const InternshipID: Schema = namedID('internship_id', 'Internship identifier');
export const BusinessID: Schema = namedID('business_id', 'Business identifier');

export const paginateValidator: Schema = {
    page: {
        in: ['query'],
        isInt: { errorMessage: 'Page number must be an integer' },
        optional: true,
        toInt: true,
    },
    limit: {
        in: ['query'],
        isInt: { errorMessage: 'Limit of entries to provide must be an integer' },
        optional: true,
        toInt: true,
    },
};
