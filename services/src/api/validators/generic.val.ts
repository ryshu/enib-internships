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
export const InternshipTypeID: Schema = namedID('internship_type_id', 'Internship type identifier');
export const BusinessID: Schema = namedID('business_id', 'Business identifier');
export const StudentID: Schema = namedID('student_id', 'Student identifier');
export const CampaignID: Schema = namedID('campaign_id', 'Campaign identifier');
export const MentorID: Schema = namedID('mentor_id', 'Mentor identifier');
export const MentoringPropositionID: Schema = namedID(
    'mentoring_proposition_id',
    'Mentoring proposition identifier',
);
export const FileID: Schema = namedID('file_id', 'File identifier');

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

export const contriesValidator: Schema = {
    countries: {
        in: ['query'],
        isArray: { errorMessage: 'Country filter list must be array' },
        optional: true,
        toArray: true,
    },
};

export const addressValidator: Schema = {
    country: {
        in: ['body'],
        isString: { errorMessage: 'Country must be of type string' },
        exists: { errorMessage: 'Country must be defined' },
        trim: true,
        escape: true,
    },
    city: {
        in: ['body'],
        isString: { errorMessage: 'City must be of type string' },
        exists: { errorMessage: 'City must be defined' },
        trim: true,
        escape: true,
    },
    postalCode: {
        in: ['body'],
        isString: { errorMessage: 'Postal code must be of type string' },
        exists: { errorMessage: 'Postal code must be defined' },
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        isString: { errorMessage: 'Address must be of type string' },
        exists: { errorMessage: 'Address must be defined' },
        trim: true,
        escape: true,
    },
    additional: {
        in: ['body'],
        isString: { errorMessage: 'Additional must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};

/**
 * @summary Method used to prevent code duplication in REST API
 * @param {Schema} schema see express-validator schema
 */
export function replaceAllExistByOptional(schema: Schema): Schema {
    const newSchema = cloneDeep(schema);

    for (const key in newSchema) {
        if (newSchema.hasOwnProperty(key)) {
            const elem = newSchema[key];
            delete elem.exists;
            elem.optional = true;
        }
    }

    return newSchema;
}
