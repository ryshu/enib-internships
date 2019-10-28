import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';

export const FileList: Schema = {
    ...paginateValidator,
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
    path: {
        in: ['body'],
        isString: { errorMessage: 'Path must be of type string' },
        exists: { errorMessage: 'Path must be defined' },
        trim: true,
        escape: true,
    },
};
export const FileUpdate = replaceAllExistByOptional(FileCreate);
