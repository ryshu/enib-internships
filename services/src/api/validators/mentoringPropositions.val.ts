import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';

export const MentoringPropositionsList: Schema = {
    ...paginateValidator,
};

export const MentoringPropositionCreate: Schema = {
    comment: {
        in: ['body'],
        isString: { errorMessage: 'Comment must be of type string' },
        exists: { errorMessage: 'Comment must be defined' },
        trim: true,
        escape: true,
    },
};

export const MentoringPropositionUpdate: Schema = replaceAllExistByOptional(
    MentoringPropositionCreate,
);
