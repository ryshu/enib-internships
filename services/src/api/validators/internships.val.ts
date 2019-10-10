import { Schema } from 'express-validator';

import { paginateValidator } from './generic.val';

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
    isLanguageCourse: {
        in: ['body'],
        isBoolean: { errorMessage: 'LanguageCourse must be of type boolean' },
        optional: true,
        toBoolean: true,
    },
    isValidated: {
        in: ['body'],
        isBoolean: { errorMessage: 'Validated must be of type boolean' },
        optional: true,
        toBoolean: true,
    },
};

export const InternshipUpdate: Schema = {
    subject: {
        in: ['body'],
        isString: { errorMessage: 'Subject must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    description: {
        in: ['body'],
        isString: { errorMessage: 'Description must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    country: {
        in: ['body'],
        isString: { errorMessage: 'Country must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    city: {
        in: ['body'],
        isString: { errorMessage: 'City must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    postalCode: {
        in: ['body'],
        isString: { errorMessage: 'Postal code must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        isString: { errorMessage: 'Address must be of type string' },
        optional: true,
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
    isLanguageCourse: {
        in: ['body'],
        isBoolean: { errorMessage: 'Language course must be of type boolean' },
        optional: true,
        toBoolean: true,
    },
    isValidated: {
        in: ['body'],
        isBoolean: { errorMessage: 'Validated must be of type boolean' },
        optional: true,
        toBoolean: true,
    },
};
