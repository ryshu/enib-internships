import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';

export const InternshipsList: Schema = {
    ...paginateValidator,
};

export const InternshipCreate: Schema = {
    subject: {
        in: ['body'],
        isString: { errorMessage: 'Subject must be of type string' },
        exists: { errorMessage: 'Subject must be defined' },
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
    country: {
        in: ['body'],
        isString: { errorMessage: 'Country must be of type string' },
        exists: { errorMessage: 'Country must be defined' },
        trim: true,
        escape: true,
    },
    city: {
        in: ['body'],
        isString: { errorMessage: 'City must be of type string' },
        exists: { errorMessage: 'City must be defined' },
        trim: true,
        escape: true,
    },
    postalCode: {
        in: ['body'],
        isString: { errorMessage: 'Postal code must be of type string' },
        exists: { errorMessage: 'Postal code must be defined' },
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        isString: { errorMessage: 'Address must be of type string' },
        exists: { errorMessage: 'Address must be defined' },
        trim: true,
        escape: true,
    },
    additional: {
        in: ['body'],
        isString: { errorMessage: 'Additional must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    isInternshipAbroad: {
        in: ['body'],
        isBoolean: { errorMessage: 'Internship abroad must be of type boolean' },
        optional: true,
        toBoolean: true,
    },
    isValidated: {
        in: ['body'],
        isBoolean: { errorMessage: 'Validated must be of type boolean' },
        optional: true,
        toBoolean: true,
    },
    startAt: {
        in: ['body'],
        isInt: { errorMessage: 'Start at must be a timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    endAt: {
        in: ['body'],
        isInt: { errorMessage: 'End at must be a timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
};

export const InternshipUpdate = replaceAllExistByOptional(InternshipCreate);
