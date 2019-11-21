import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional, contriesValidator } from './generic.val';
import {
    internshipVal,
    categoryVal,
    studentVal,
    fileVal,
    mentorVal,
    businessVal,
    propositionsVal,
    campaignVal,
} from './generator.val';

const modes = ['published', 'propositions', 'self'];

export const InternshipsList: Schema = {
    ...paginateValidator,
    ...contriesValidator,
    types: {
        in: ['query'],
        isArray: { errorMessage: 'Category filter list must be array' },
        optional: true,
        toArray: true,
    },
    subject: {
        in: ['query'],
        isString: { errorMessage: 'Subject should be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    mode: {
        in: ['query'],
        isString: { errorMessage: 'Mode should be a string' },
        isIn: {
            options: [modes],
            errorMessage: `Mode should be included in [${modes.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
    isAbroad: {
        in: ['query'],
        isBoolean: { errorMessage: 'Abroad should be of type boolean' },
        optional: true,
        toBoolean: true,
    },
    isValidated: {
        in: ['query'],
        isBoolean: { errorMessage: 'Validated should be of type boolean' },
        optional: true,
        toBoolean: true,
    },
};

export const InternshipCreate: Schema = {
    ...internshipVal(),
    ...replaceAllExistByOptional(categoryVal('category')),
    ...replaceAllExistByOptional(studentVal('student')),
    ...replaceAllExistByOptional(fileVal('files[*]')),
    ...replaceAllExistByOptional(mentorVal('mentor')),
    ...replaceAllExistByOptional(businessVal('business')),
    ...replaceAllExistByOptional(propositionsVal('propositions[*]')),
    ...replaceAllExistByOptional(campaignVal('validatedCampaign')),
    ...replaceAllExistByOptional(campaignVal('availableCampaign')),
};

export const InternshipUpdate = replaceAllExistByOptional(InternshipCreate);
