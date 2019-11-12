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
    type: {
        in: ['body'],
        isString: { errorMessage: 'Type must be of type string' },
        exists: { errorMessage: 'Type must be defined' },
        trim: true,
        escape: true,
    },
};
export const FileUpdate = replaceAllExistByOptional(FileCreate);
