import { Schema } from 'express-validator';

export const ID: Schema = {
    id: {
        in: ['params'],
        isInt: { errorMessage: 'Identifier must be a string' },
        exists: { errorMessage: 'Identifier must be defined' },
        toInt: true,
    },
};

export const paginateValidator: Schema = {
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
