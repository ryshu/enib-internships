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

export const archivedValidator: Schema = {
    archived: {
        in: ['query'],
        isBoolean: { errorMessage: 'Archived field must be a boolean' },
        optional: true,
        toBoolean: true,
    },
};

export const countriesValidator: Schema = {
    countries: {
        in: ['query'],
        isArray: { errorMessage: 'Country filter list must be array' },
        optional: true,
        toArray: true,
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
