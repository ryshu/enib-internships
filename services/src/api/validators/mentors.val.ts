import { Schema } from 'express-validator';

import { paginateValidator } from './generic.val';

import { mentorRoles } from '../../utils/type';

export const MentorList: Schema = {
    ...paginateValidator,
};

export const MentorCreate: Schema = {
    firstName: {
        in: ['body'],
        isString: { errorMessage: 'First name must be of type string' },
        exists: { errorMessage: 'First name must be defined' },
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: { errorMessage: 'Last name must be of type string' },
        exists: { errorMessage: 'Last name must be defined' },
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        isString: { errorMessage: 'Email must be of type string' },
        isEmail: { errorMessage: 'Email must complain to email struct' },
        exists: { errorMessage: 'Email must be defined' },
        trim: true,
        escape: true,
    },
    role: {
        in: ['body'],
        isString: { errorMessage: 'Role must be of type string' },
        isIn: {
            options: [mentorRoles],
            errorMessage: `Role must be in [${mentorRoles.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
};
export const MentorUpdate: Schema = {
    firstName: {
        in: ['body'],
        isString: { errorMessage: 'First name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: { errorMessage: 'Last name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        isString: { errorMessage: 'Email must be of type string' },
        isEmail: { errorMessage: 'Email must complain to email struct' },
        optional: true,
        trim: true,
        escape: true,
    },
    role: {
        in: ['body'],
        isString: { errorMessage: 'Role must be of type string' },
        isIn: {
            options: [mentorRoles],
            errorMessage: `Role must be in [${mentorRoles.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
};
