import { Schema } from 'express-validator';
import { replaceAllExistByOptional } from './generic.val';

export const InternshipTypeCreate: Schema = {
    label: {
        in: ['body'],
        isString: { errorMessage: 'Label must be of type string' },
        exists: { errorMessage: 'Label must be defined' },
        trim: true,
        escape: true,
    },
};

export const InternshipTypeUpdate = replaceAllExistByOptional(InternshipTypeCreate);
