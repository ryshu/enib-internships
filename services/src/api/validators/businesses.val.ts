import { Schema } from 'express-validator';

import {
    paginateValidator,
    replaceAllExistByOptional,
    contriesValidator,
    addressValidator,
} from './generic.val';

export const BusinessesList: Schema = {
    ...paginateValidator,
    ...contriesValidator,
    name: {
        in: ['query'],
        isString: { errorMessage: 'Name filter must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};

export const BusinessCreate: Schema = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },

    ...addressValidator,
};

export const BusinessUpdate = replaceAllExistByOptional(BusinessCreate);
