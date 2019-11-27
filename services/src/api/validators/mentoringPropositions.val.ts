import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional, archivedValidator } from './generic.val';
import { propositionsVal, campaignVal, mentorVal, internshipVal } from './generator.val';

export const MentoringPropositionsList: Schema = {
    ...paginateValidator,
    ...archivedValidator,
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
