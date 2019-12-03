import { Schema } from 'express-validator';
import { replaceAllExistByOptional, archivedValidator } from './generic.val';
import { categoryVal, internshipVal, campaignVal } from './generator.val';

export const InternshipTypeList: Schema = {
    ...archivedValidator,
};

export const InternshipTypeCreate: Schema = {
    ...categoryVal(),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
    ...replaceAllExistByOptional(campaignVal('campaigns[*]')),
};

export const InternshipTypeUpdate = replaceAllExistByOptional(InternshipTypeCreate);
