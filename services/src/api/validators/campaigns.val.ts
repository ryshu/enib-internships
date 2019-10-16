import { Schema } from 'express-validator';

import { paginateValidator } from './generic.val';

export const CampaignList: Schema = {
    ...paginateValidator,
};

export const CampaignCreate: Schema = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    startAt: {
        in: ['body'],
        isInt: { errorMessage: 'Start At must be of type number(date)', options: { min: 0 } },
        exists: { errorMessage: 'Start At must be defined' },
        toInt: true,
    },
    endAt: {
        in: ['body'],
        isInt: { errorMessage: 'End At must be of type number(date)', options: { min: 0 } },
        exists: { errorMessage: 'End At must be defined' },
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
        isInt: { errorMessage: 'maxProposition must be of type number', options: { min: 0 } },
        toInt: true,
        optional: true,
    },
};

export const CampaignUpdate: Schema = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    startAt: {
        in: ['body'],
        isNumeric: { errorMessage: 'StartAt must be of type numeric(date)' },
        optional: true,
        trim: true,
        escape: true,
    },
    endAt: {
        in: ['body'],
        isNumeric: { errorMessage: 'endAt must be of type numeric(date)' },
        optional: true,
        trim: true,
        escape: true,
    },
    semester: {
        in: ['body'],
        isString: { errorMessage: 'Semester must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    maxProposition: {
        in: ['body'],
        isNumeric: { errorMessage: 'MaxProposition must be of type numeric' },
        optional: true,
        trim: true,
        escape: true,
    },
};
