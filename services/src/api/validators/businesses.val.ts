import { Schema } from 'express-validator';

import {
    paginateValidator,
    replaceAllExistByOptional,
    contriesValidator,
    archivedValidator,
} from './generic.val';

import { businessVal, internshipVal, categoryVal } from './generator.val';

export const BusinessesList: Schema = {
    ...paginateValidator,
    ...contriesValidator,
    ...archivedValidator,
    name: {
        in: ['query'],
        isString: { errorMessage: 'Name filter must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};

export const BusinessCreate: Schema = {
    ...businessVal(),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
    ...replaceAllExistByOptional(categoryVal('internships[*].category')),
};
export const BusinessUpdate = replaceAllExistByOptional(BusinessCreate);
