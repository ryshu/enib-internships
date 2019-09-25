import { Schema } from 'express-validator';

export const ID: Schema = {
    id: {
        in: ['params'],
        isInt: { errorMessage: 'Identifier must be a string' },
        exists: { errorMessage: 'Identifier must be defined' },
        toInt: true,
    },
};
