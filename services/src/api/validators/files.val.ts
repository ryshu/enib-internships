import { Schema } from 'express-validator';

export const FileList: Schema = {
    page: {
        in: ['query'],
        isInt: { errorMessage: 'Page number must be an integer' },
        optional: true,
        toInt: true,
    },
    limit: {
        in: ['query'],
        isInt: { errorMessage: 'Limit of entries to provide must be an integer' },
        optional: true,
        toInt: true,
    },
};

export const FileCreate: Schema = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    size: {
        in: ['body'],
        isInt: { errorMessage: 'Size must be of type integer' },
        exists: { errorMessage: 'Size must be defined' },
        trim: true,
        escape: true,
    },
    type: {
        in: ['body'],
        isString: { errorMessage: 'Type must be of type string' },
        exists: { errorMessage: 'Type must be defined' },
        trim: true,
        escape: true,
    },
};
export const FileUpdate: Schema = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        optional: true,
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    size: {
        in: ['body'],
        isInt: { errorMessage: 'Size must be of type integer' },
        optional: true,
        exists: { errorMessage: 'Size must be defined' },
        trim: true,
        escape: true,
    },
    type: {
        in: ['body'],
        isString: { errorMessage: 'Type must be of type string' },
        optional: true,
        exists: { errorMessage: 'Type must be defined' },
        trim: true,
        escape: true,
    },
};
