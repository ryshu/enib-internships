import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional, archivedValidator } from './generic.val';

import { propositionsVal, campaignVal, mentorVal, internshipVal } from './generator.val';

// All available associations label for includes filter
const mentoringPropositionIncludes = ['internship', 'campaign', 'mentor', 'student', 'business'];

export const MentoringPropositionsList: Schema = {
    ...paginateValidator,
    ...archivedValidator,
    'includes': {
        in: ['query'],
        isArray: { errorMessage: 'Internship includes should be provide under array form' },
        optional: true,
        toArray: true,
    },
    'includes[*]': {
        in: ['query'],
        isString: { errorMessage: 'Include should be a string' },
        isIn: {
            options: [mentoringPropositionIncludes],
            errorMessage: `Include should be available in following list: [${mentoringPropositionIncludes.join(
                ', ',
            )}]`,
        },
        optional: true,
        trim: true,
    },
};

export const MentoringPropositionCreate: Schema = {
    ...propositionsVal(),
    ...replaceAllExistByOptional(campaignVal('campaign')),
    ...replaceAllExistByOptional(mentorVal('mentor')),
    ...replaceAllExistByOptional(internshipVal('internship')),
};

export const MentoringPropositionUpdate: Schema = replaceAllExistByOptional(
    MentoringPropositionCreate,
);
