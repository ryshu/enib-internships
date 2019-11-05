import { Schema } from 'express-validator';

import { replaceAllExistByOptional } from './generic.val';

export const CampaignList: Schema = {};

export const CampaignCreate: Schema = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    description: {
        in: ['body'],
        isString: { errorMessage: 'Description must be of type string' },
        exists: { errorMessage: 'Description must be defined' },
        trim: true,
        escape: true,
    },
    startAt: {
        in: ['body'],
        isInt: { errorMessage: 'Start At must be of type timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    endAt: {
        in: ['body'],
        isInt: { errorMessage: 'End At must be of type timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    semester: {
        in: ['body'],
        isString: { errorMessage: 'Semester must be of type string' },
        exists: { errorMessage: 'Semester must be defined' },
        trim: true,
        escape: true,
    },
    maxProposition: {
        in: ['body'],
        isInt: { errorMessage: 'maxProposition must be an integer >= 0', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
};

export const CampaignUpdate = replaceAllExistByOptional(CampaignCreate);
