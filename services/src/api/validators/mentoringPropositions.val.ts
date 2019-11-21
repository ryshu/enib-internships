import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';
import { propositionsVal, campaignVal, mentorVal, internshipVal } from './generator.val';

export const MentoringPropositionsList: Schema = {
    ...paginateValidator,
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
