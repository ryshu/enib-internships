import { Schema } from 'express-validator';

import {
    paginateValidator,
    replaceAllExistByOptional,
    countriesValidator,
    ID,
    archivedValidator,
} from './generic.val';

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

import { InternshipsMode, InternshipsResult } from '../../internship';

// All available associations label for includes filter
const InternshipAvailableIncludes = [
    'files',
    'student',
    'mentor',
    'availableCampaign',
    'validatedCampaign',
    'propositions',
    'business',
    'category',
];

export const InternshipsList: Schema = {
    ...paginateValidator,
    ...countriesValidator,
    ...archivedValidator,
    'types': {
        in: ['query'],
        isArray: { errorMessage: 'Category filter list must be array' },
        optional: true,
        toArray: true,
    },
    'subject': {
        in: ['query'],
        isString: { errorMessage: 'Subject should be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    'mode': {
        in: ['query'],
        isArray: { errorMessage: 'Internship mode should be provide under array form' },
        optional: true,
        toArray: true,
    },
    'mode[*]': {
        in: ['query'],
        isString: { errorMessage: 'Mode should be a string' },
        isIn: {
            options: [InternshipsMode],
            errorMessage: `Mode should be included in [${InternshipsMode.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
    'isAbroad': {
        in: ['query'],
        isBoolean: { errorMessage: 'Abroad should be of type boolean' },
        optional: true,
        toBoolean: true,
    },
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
            options: [InternshipAvailableIncludes],
            errorMessage: `Include should be available in following list: [${InternshipAvailableIncludes.join(
                ', ',
            )}]`,
        },
        optional: true,
        trim: true,
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

export const InternshipFSM: Schema = {
    ...ID,
    state: {
        in: ['body'],
        isString: { errorMessage: 'State should be a string' },
        isIn: {
            options: [InternshipsMode],
            errorMessage: `State should be included in [${InternshipsMode.join(', ')}]`,
        },
        exists: { errorMessage: 'Should should be defined' },
        trim: true,
    },
    campaignId: {
        in: ['body'],
        isInt: { errorMessage: `Campaign identifier must be an integer` },
        optional: true,
        toInt: true,
    },
    mentorId: {
        in: ['body'],
        isInt: { errorMessage: `Mentor identifier must be an integer` },
        optional: true,
        toInt: true,
    },
    studentId: {
        in: ['body'],
        isInt: { errorMessage: `Student must be an integer` },
        optional: true,
        toInt: true,
    },
    result: {
        in: ['body'],
        isString: { errorMessage: 'Result should be a string' },
        isIn: {
            options: [InternshipsResult],
            errorMessage: `Result should be included in [${InternshipsResult.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
    endAt: {
        in: ['body'],
        isInt: { errorMessage: `End at must be an integer` },
        optional: true,
        toInt: true,
    },
};
