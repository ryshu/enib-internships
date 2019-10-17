import { Schema } from 'express-validator';

export const InternshipTypeCreate: Schema = {
    label: {
        in: ['body'],
        isString: { errorMessage: 'Label must be of type string' },
        exists: { errorMessage: 'Label must be defined' },
        trim: true,
        escape: true,
    },
};

export const InternshipTypeUpdate: Schema = {
    label: {
        in: ['body'],
        isString: { errorMessage: 'Label must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};
