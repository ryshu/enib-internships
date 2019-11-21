import { Schema } from 'express-validator';

import { replaceAllExistByOptional } from './generic.val';
import {
    campaignVal,
    categoryVal,
    propositionsVal,
    mentorVal,
    internshipVal,
} from './generator.val';

export const CampaignList: Schema = {};

export const CampaignCreate: Schema = {
    ...campaignVal(),
    ...replaceAllExistByOptional(categoryVal('category')),
    ...replaceAllExistByOptional(propositionsVal('propositions[*]')),
    ...replaceAllExistByOptional(mentorVal('mentors[*]')),
    ...replaceAllExistByOptional(internshipVal('validatedInternships[*]')),
    ...replaceAllExistByOptional(internshipVal('availableInternships[*]')),
};
export const CampaignUpdate: Schema = replaceAllExistByOptional(CampaignCreate);
