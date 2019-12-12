import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional, archivedValidator } from './generic.val';
import { mentorVal, campaignVal, internshipVal, propositionsVal } from './generator.val';

export const MentorList: Schema = {
    ...paginateValidator,
    ...archivedValidator,
    name: {
        in: ['query'],
        isString: { errorMessage: 'Name query param should be a string' },
        optional: true,
        trim: true,
        escape: true,
    },
};

export const MentorCreate: Schema = {
    ...mentorVal(),
    ...replaceAllExistByOptional(campaignVal('campaigns[*]')),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
    ...replaceAllExistByOptional(propositionsVal('propositions[*]')),
};

export const MentorUpdate = replaceAllExistByOptional(MentorCreate);
