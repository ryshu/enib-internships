import { Schema } from 'express-validator';
import { replaceAllExistByOptional } from './generic.val';
import { categoryVal, internshipVal, campaignVal } from './generator.val';

export const InternshipTypeCreate: Schema = {
    ...categoryVal(),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
    ...replaceAllExistByOptional(campaignVal('campaigns[*]')),
};

export const InternshipTypeUpdate = replaceAllExistByOptional(InternshipTypeCreate);
