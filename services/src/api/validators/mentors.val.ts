import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';
import { mentorVal, campaignVal, internshipVal, propositionsVal } from './generator.val';

export const MentorList: Schema = {
    ...paginateValidator,
};

export const MentorCreate: Schema = {
    ...mentorVal(),
    ...replaceAllExistByOptional(campaignVal('campaigns[*]')),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
    ...replaceAllExistByOptional(propositionsVal('propositions[*]')),
};

export const MentorUpdate = replaceAllExistByOptional(MentorCreate);
